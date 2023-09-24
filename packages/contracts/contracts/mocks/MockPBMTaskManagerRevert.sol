// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.13;

import "../interfaces/IPBMTaskManager.sol";
import "../interfaces/PBMTaskManagerErrors.sol";

error FakeError();

contract MockPBMTaskManagerRevert is IPBMTaskManager, PBMTaskManagerErrors {
    constructor() {}

    function createWithdrawalTask(address /*payee*/, uint256 /*depositId*/) external pure {
        revert FakeError();
    }

    function execWithdrawal(
        address /*payee*/,
        uint256 /*depositId*/
    ) external pure returns (bool /*success*/) {
        revert FakeError();
    }

    function cancelWithdrawalTask(uint256 /*depositId*/) external pure returns (bool) {
        revert FakeError();
    }

    function getTaskId(uint256 /*depositId*/) public pure returns (bytes32) {
        return 0;
    }
}
