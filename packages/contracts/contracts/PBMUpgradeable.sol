// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.13;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "./base/PBMBase.sol";

contract PBMUpgradeable is UUPSUpgradeable, PBMBase {
    function initialize(
        string memory _name,
        string memory _symbol,
        address asset_,
        address vault_
    ) public initializer {
        __PBMBase_init(_name, _symbol, asset_, vault_);
    }

    function _authorizeUpgrade(address) internal view virtual override onlyAdmin {}
}
