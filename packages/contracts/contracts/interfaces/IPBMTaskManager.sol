// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.13;

interface IPBMTaskManager {
    function createWithdrawalTask(address payee, uint256 depositId) external;

    function execWithdrawal(address payee, uint256 depositId) external returns (bool success);
}
