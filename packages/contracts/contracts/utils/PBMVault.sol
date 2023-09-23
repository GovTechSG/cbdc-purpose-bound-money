// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.13;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "../base/PBMVaultBase.sol";

contract PBMVault is UUPSUpgradeable, PBMVaultBase {
    constructor(string memory _name, string memory _symbol) {
        initialize(_name, _symbol);
    }

    function initialize(string memory _name, string memory _symbol) public initializer {
        __PBMVaultBase_init(_name, _symbol);
    }

    function _authorizeUpgrade(address) internal view virtual override onlyOwner {}
}
