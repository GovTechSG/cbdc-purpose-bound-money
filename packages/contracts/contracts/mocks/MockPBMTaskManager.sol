// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.13;

import "../interfaces/IPBMTaskManager.sol";
import "../interfaces/PBMTaskManagerErrors.sol";

contract MockPBMTaskManager is IPBMTaskManager, PBMTaskManagerErrors {
    event WithdrawalTaskCreated(
        bytes32 indexed taskId,
        address indexed payee,
        uint256 indexed depositId
    );

    event WithdrawalTaskExecution(bytes32 indexed taskId, bool indexed success);

    constructor() {}

    function createWithdrawalTask(address /*payee*/, uint256 /*depositId*/) external {
        emit WithdrawalTaskCreated(0, address(0), 0);
    }

    function execWithdrawal(address /*payee*/, uint256 /*depositId*/) external returns (bool success) {
        success = true;

        emit WithdrawalTaskExecution(0, success);
    }
}
