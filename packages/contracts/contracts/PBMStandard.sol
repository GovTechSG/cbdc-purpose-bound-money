// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.13;

import "./base/PBMBase.sol";

contract PBMStandard is PBMBase {
    constructor(
        string memory _name,
        string memory _symbol,
        address asset_,
        address vault_
    ) {
        initialize(_name, _symbol, asset_, vault_);
    }

    function initialize(
        string memory _name,
        string memory _symbol,
        address asset_,
        address vault_
    ) internal initializer {
        __PBMBase_init(_name, _symbol, asset_, vault_);
    }
}
