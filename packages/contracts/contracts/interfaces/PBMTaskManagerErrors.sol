// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.13;

interface PBMTaskManagerErrors {
    error TaskExists();

    error TaskCallerNotPBM();

    error CallerNotFundsOwner();

    error UnauthorisedCaller();
}
