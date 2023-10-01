// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.13;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/IERC20MetadataUpgradeable.sol";
import "./PBMAccessControl.sol";
import "../utils/PBMVault.sol";
import "../interfaces/IPBM.sol";
import "../interfaces/PBMBaseErrors.sol";
import "../interfaces/IPBMTaskManager.sol";

contract PBMBase is PausableUpgradeable, PBMAccessControl, ERC20Upgradeable, IPBM, PBMBaseErrors {
    using SafeERC20Upgradeable for IERC20MetadataUpgradeable;

    IERC20MetadataUpgradeable internal _asset;
    uint8 internal _decimals;

    PBMVault internal _vault;

    IPBMTaskManager public taskManager;

    uint256 private _cancelTaskCatchCount;

    function __PBMBase_init(
        string memory _name,
        string memory _symbol,
        address asset_,
        address vault_
    ) internal onlyInitializing {
        __ERC20_init(_name, _symbol);
        __PBMAccessControl_init(_msgSender());

        uint256 cSize;
        assembly {
            cSize := extcodesize(asset_)
        }
        if (cSize == 0) {
            _decimals = super.decimals();
        } else {
            try IERC20MetadataUpgradeable(asset_).decimals() returns (uint8 val) {
                _decimals = val;
            } catch {
                _decimals = super.decimals();
            }
        }

        _asset = IERC20MetadataUpgradeable(asset_);
        _vault = PBMVault(vault_);
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    function asset() external view virtual returns (address) {
        return address(_asset);
    }

    function totalAsset() public view returns (uint256) {
        return _asset.balanceOf(address(this));
    }

    function vault() public view returns (address) {
        return address(_vault);
    }

    function withdraw(
        address payee,
        uint256[] calldata depositIds
    ) external whenNotPaused returns (uint256) {
        return _vault.withdraw(payee, depositIds);
    }

    function _pay(address payee, uint256 amount, uint64 lockPeriod, bool autoWithdrawal) internal {
        if (lockPeriod == 0) {
            _mint(payee, amount);
        } else {
            _mint(address(this), amount);
            _approve(address(this), address(_vault), amount);
            (uint256 depositId, ) = _vault.deposit(_msgSender(), payee, amount, lockPeriod);

            if (autoWithdrawal) {
                if (address(taskManager) == address(0)) {
                    revert TaskManagerNotFound();
                }
                taskManager.createWithdrawalTask(payee, depositId);
            }
        }
        _asset.safeTransferFrom(_msgSender(), address(this), amount);

        emit Payment(_msgSender(), payee, amount, lockPeriod);
    }

    function pay(
        address payee,
        uint256 amount,
        uint64 lockPeriod,
        bool autoWithdrawal
    ) external whenNotPaused isPayee(payee) onlyPayer {
        _pay(payee, amount, lockPeriod, autoWithdrawal);
    }

    function _refund(address payee, uint256 depositId) internal returns (DepositInfo memory) {
        DepositInfo memory deposit = _vault.refund(payee, depositId);
        _burn(deposit.depositor, deposit.amount);
        _asset.safeTransfer(deposit.depositor, deposit.amount);

        emit Refund(depositId, payee, _msgSender(), deposit.depositor, deposit.amount);

        if (address(taskManager) != address(0)) {
            try taskManager.cancelWithdrawalTask(depositId) returns (bool) {} catch {
                // Workaround for an issue with automate contract
                ++_cancelTaskCatchCount;
                emit TaskManagerCancelWithdrawalFailed(payee, depositId);
            }
        }

        return deposit;
    }

    function chargeback(address payee, uint256 depositId) external whenNotPaused onlyTreasurer {
        _refund(payee, depositId);
    }

    function refund(uint256 depositId) external whenNotPaused onlyPayee {
        _refund(_msgSender(), depositId);
    }

    function redeem(uint256 amount) external whenNotPaused onlyPayee {
        _burn(_msgSender(), amount);
        _asset.safeTransfer(_msgSender(), amount);

        emit Redemption(_msgSender(), amount);
    }

    function pause() external onlyAdmin {
        _pause();
    }

    function unpause() external onlyAdmin {
        _unpause();
    }

    function recover(
        address recipient
    ) external whenNotPaused onlyAdmin isAdmin(recipient) returns (uint256) {
        uint256 value = totalAsset() - totalSupply();
        _mint(recipient, value);
        return value;
    }

    function emergencyWithdraw(address recipient) external whenPaused onlyAdmin {
        uint256 balance = _asset.balanceOf(address(this));
        _asset.safeTransfer(recipient, balance);

        emit EmergencyWithdrawal(_msgSender(), recipient, balance);
    }

    function setTaskManager(address payable _taskManager) external onlyAdmin {
        taskManager = IPBMTaskManager(_taskManager);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override whenNotPaused {}
}
