// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.13;

interface PBMAccessControlErrors {
    error InvalidAdminAddress();

    error UnauthorisedCaller(address caller, bytes32 role);

    error AccountHasNoRole(address account, bytes32 role);

    error RenounceRoleNotAllowed(address account, bytes32 role);
}
