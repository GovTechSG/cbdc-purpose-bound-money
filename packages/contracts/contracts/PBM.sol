// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.13;

import "./PBMUpgradeable.sol";

contract PBM is PBMUpgradeable {
    constructor(
        string memory _name,
        string memory _symbol
    ) PBMUpgradeable(_name, _symbol) {}
}
