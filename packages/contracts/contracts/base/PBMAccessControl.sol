// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.13;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "../interfaces/PBMAccessControlErrors.sol";

contract PBMAccessControl is AccessControlUpgradeable, PBMAccessControlErrors {
    bytes32 public constant PAYER_ROLE = keccak256("PAYER_ROLE");
    bytes32 public constant PAYEE_ROLE = keccak256("PAYEE_ROLE");
    bytes32 public constant TREASURER_ROLE = keccak256("TREASURER_ROLE");

    modifier onlyTreasurer() {
        if (!_hasTreasurerRole(_msgSender())) {
            revert UnauthorisedCaller(_msgSender(), TREASURER_ROLE);
        }
        _;
    }

    modifier onlyPayer() {
        if (!_hasPayerRole(_msgSender())) {
            revert UnauthorisedCaller(_msgSender(), PAYER_ROLE);
        }
        _;
    }

    modifier onlyPayee() {
        if (!_hasPayeeRole(_msgSender())) {
            revert UnauthorisedCaller(_msgSender(), PAYEE_ROLE);
        }
        _;
    }

    modifier isPayee(address account) {
        if (!_hasPayeeRole(account)) {
            revert AccountHasNoRole(account, PAYEE_ROLE);
        }
        _;
    }

    modifier onlyAdmin() {
        if (!hasRole(DEFAULT_ADMIN_ROLE, _msgSender())) {
            revert UnauthorisedCaller(_msgSender(), DEFAULT_ADMIN_ROLE);
        }
        _;
    }

    modifier isAdmin(address account) {
        if (!hasRole(DEFAULT_ADMIN_ROLE, account)) {
            revert AccountHasNoRole(account, DEFAULT_ADMIN_ROLE);
        }
        _;
    }

    function __PBMAccessControl_init(address admin) internal onlyInitializing {
        if (admin == address(0)) {
            revert InvalidAdminAddress();
        }
        _setupRole(DEFAULT_ADMIN_ROLE, admin);
        _setupRole(TREASURER_ROLE, admin);
        _setupRole(PAYER_ROLE, admin);
        _setupRole(PAYEE_ROLE, admin);
    }

    function _hasTreasurerRole(address account) internal view returns (bool) {
        return hasRole(TREASURER_ROLE, account);
    }

    function _hasPayerRole(address account) internal view returns (bool) {
        return hasRole(PAYER_ROLE, account);
    }

    function _hasPayeeRole(address account) internal view returns (bool) {
        return hasRole(PAYEE_ROLE, account);
    }

    function renounceRole(bytes32 role, address account) public virtual override {
        revert RenounceRoleNotAllowed(account, role);
    }
}
