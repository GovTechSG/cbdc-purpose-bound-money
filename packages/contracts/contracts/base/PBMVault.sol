// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.13;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@superical/time-lock-vault/contracts/TimeLockVault.sol";

error CallerNotPBM();

contract PBMVault is OwnableUpgradeable, TimeLockVault {
    modifier onlyPBM() {
        if (_msgSender() != asset()) {
            revert CallerNotPBM();
        }
        _;
    }

    function initialize(string memory _name, string memory _symbol) public initializer {
        __TimeLockVault_init(_name, _symbol, address(0));
        __Ownable_init();
    }

    function setPBM(address pbm) external onlyOwner {
        _setAsset(pbm);
    }

    function deposit(
        address payer,
        address payee,
        uint256 amount,
        uint64 lockPeriod
    ) external virtual onlyPBM returns (uint256, DepositInfo memory) {
        return _deposit(payer, payee, amount, lockPeriod);
    }

    function withdraw(
        address from,
        uint256[] calldata depositIds
    ) external virtual onlyPBM returns (uint256) {
        return _batchWithdraw(from, from, depositIds);
    }

    function refund(
        address payee,
        uint256 depositId
    ) external virtual onlyPBM returns (DepositInfo memory) {
        address payer = getDeposit(depositId).depositor;
        DepositInfo memory deposit_ = _prematureWithdraw(payee, payer, depositId);
        if (deposit_.redeemTimestamp < block.timestamp) {
            revert DepositAlreadyMatured();
        }

        return deposit_;
    }
}
