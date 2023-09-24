// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.13;

interface IPBMTaskManager {
    event WithdrawalTaskExecution(bytes32 indexed taskId, bool indexed success);

    function createWithdrawalTask(address payee, uint256 depositId) external;

    function execWithdrawal(address payee, uint256 depositId) external returns (bool success);

    function cancelWithdrawalTask(uint256 depositId) external returns (bool success);

    function getTaskId(uint256 depositId) external view returns (bytes32);
}
