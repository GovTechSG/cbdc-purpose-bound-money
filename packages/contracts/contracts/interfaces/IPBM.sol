// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.13;

interface IPBM {
    event Refund(
        uint256 indexed paymentId,
        address indexed payee,
        address indexed caller,
        address payer,
        uint256 amount
    );

    event Redemption(address indexed redeemer, uint256 amount);

    event Payment(address indexed payer, address indexed payee, uint256 amount, uint64 lockPeriod);

    event EmergencyWithdrawal(address indexed caller, address indexed recipient, uint256 amount);

    event TaskManagerCancelWithdrawalFailed(address indexed payee, uint256 indexed depositId);

    function asset() external view returns (address);

    function totalAsset() external view returns (uint256);

    function vault() external view returns (address);

    function withdraw(address payee, uint256[] calldata depositIds) external returns (uint256);

    function pay(address payee, uint256 amount, uint64 lockPeriod, bool autoWithdrawal) external;

    function chargeback(address payee, uint256 paymentId) external;

    function refund(uint256 paymentId) external;

    function redeem(uint256 amount) external;
}
