// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.13;

import "./interfaces/IPBMTaskManager.sol";
import "./interfaces/PBMTaskManagerErrors.sol";
import "./interfaces/IPBM.sol";
import "./lib/gelato-automate/AutomateTaskCreator.sol";
import "./utils/PBMVault.sol";

contract PBMTaskManager is AutomateTaskCreator, IPBMTaskManager, PBMTaskManagerErrors {
    IPBM public immutable PBM;
    mapping(bytes32 => bool) public taskIds;
    mapping(bytes32 => uint8) public taskRetries;

    uint256 public constant INTERVAL = 3 minutes;
    uint8 public constant MAX_RETRIES = 5;

    constructor(
        address _pbm,
        address payable _automate,
        address _fundsOwner
    ) AutomateTaskCreator(_automate, _fundsOwner) {
        PBM = IPBM(_pbm);
    }

    modifier onlyPBM() {
        if (msg.sender != address(PBM)) {
            revert TaskCallerNotPBM();
        }
        _;
    }

    function createWithdrawalTask(address payee, uint256 depositId) external onlyPBM {
        uint256 startTime = _getDepositStartTime(depositId);

        if (taskIds[_getWithdrawalTaskId(startTime, depositId)]) {
            revert TaskExists();
        }

        ModuleData memory moduleData = _createModuleData(startTime, depositId);

        bytes memory execData = abi.encodeCall(this.execWithdrawal, (payee, depositId));
        bytes32 taskId = _createTask(address(this), execData, moduleData, ETH);
        taskIds[taskId] = true;

        emit WithdrawalTaskCreated(taskId, payee, depositId);
    }

    function cancelWithdrawalTask(uint256 depositId) external onlyPBM {
        bytes32 taskId = getTaskId(depositId);

        if (taskIds[taskId]) {
            _cleanCancelTask(taskId);

            emit WithdrawalTaskCancelled(taskId, depositId);
        }
    }

    function execWithdrawal(
        address payee,
        uint256 depositId
    ) external onlyDedicatedMsgSender returns (bool success) {
        success = _execWithdrawal(payee, depositId);

        bytes32 taskId = getTaskId(depositId);

        if (success) {
            _cleanCancelTask(taskId);
        } else {
            uint8 retryCount = ++taskRetries[taskId];
            if (retryCount > MAX_RETRIES) {
                _cleanCancelTask(taskId);
            }
        }

        (uint256 fee, address feeToken) = _getFeeDetails();
        _transfer(fee, feeToken);

        emit WithdrawalTaskExecution(taskId, success);
    }

    function getTaskId(uint256 depositId) public view returns (bytes32) {
        return _getWithdrawalTaskId(_getDepositStartTime(depositId), depositId);
    }

    function withdrawETH(address to) external {
        if (msg.sender != fundsOwner) {
            revert CallerNotFundsOwner();
        }

        payable(to).transfer(address(this).balance);
    }

    function _getDepositStartTime(uint256 depositId) internal view returns (uint256) {
        PBMVault vault = PBMVault(PBM.vault());
        return uint256(vault.getDeposit(depositId).redeemTimestamp);
    }

    function _cleanCancelTask(bytes32 taskId) internal {
        _cancelTask(taskId);

        // Reset task states
        delete taskRetries[taskId];
        delete taskIds[taskId];
    }

    function _createModuleData(
        uint256 startTime,
        uint256 depositId
    ) internal pure returns (ModuleData memory) {
        ModuleData memory moduleData = ModuleData({
            modules: new Module[](2),
            args: new bytes[](2)
        });

        moduleData.modules[0] = Module.TIME;
        moduleData.modules[1] = Module.PROXY;

        uint256 interval = INTERVAL + (depositId % 120);

        moduleData.args[0] = _timeModuleArg(startTime, interval);
        moduleData.args[1] = _proxyModuleArg();

        return moduleData;
    }

    function _execWithdrawal(address payee, uint256 depositId) internal returns (bool success) {
        uint256[] memory depositIds = new uint256[](1);
        depositIds[0] = depositId;

        try PBM.withdraw(payee, depositIds) {
            success = true;
        } catch {
            success = false;
        }
    }

    function _getWithdrawalTaskId(
        uint256 startTime,
        uint256 depositId
    ) internal view returns (bytes32) {
        ModuleData memory moduleData = _createModuleData(startTime, depositId);
        return
            automate.getTaskId(
                address(this),
                address(this),
                this.execWithdrawal.selector,
                moduleData,
                ETH
            );
    }

    receive() external payable {}
}
