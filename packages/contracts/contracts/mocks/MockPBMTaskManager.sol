// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.13;

import "../interfaces/IPBMTaskManager.sol";
import "../interfaces/PBMTaskManagerErrors.sol";

contract MockPBMTaskManager is IPBMTaskManager, PBMTaskManagerErrors {
    constructor() {}

    function createWithdrawalTask(address /*payee*/, uint256 /*depositId*/) external {
        emit WithdrawalTaskCreated(0, address(0), 0);
    }

    function execWithdrawal(
        address /*payee*/,
        uint256 /*depositId*/
    ) external returns (bool success) {
        success = true;

        emit WithdrawalTaskExecution(0, success);
    }

    function cancelWithdrawalTask(uint256 /*depositId*/) external {}

    function getTaskId(uint256 /*depositId*/) public pure returns (bytes32) {
        return 0;
    }
}
