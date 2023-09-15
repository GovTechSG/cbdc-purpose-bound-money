import { time } from "@nomicfoundation/hardhat-network-helpers";
import { ContractReceipt } from "ethers";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import { parseAmount } from "../../test/utils";
import { PBMUpgradeable, PBMVault } from "../../types";

type DeployPaymentFixturesArguments = {
  pbm: string;
} & TaskArguments;

task("fixtures:payments", "Send payment fixtures")
  .addParam("pbm", "PBM address")
  .setAction(async function (taskArguments: DeployPaymentFixturesArguments, { ethers }) {
    const oneDayInterval = 60 * 60 * 24; // 1 day
    const [_deployer, admin, payer, _payee, treasurer, ...signers] = await ethers.getSigners();

    const payees = signers.slice(0, 3);

    const pbmContract = (await ethers.getContractAt(
      "PBMUpgradeable",
      taskArguments.pbm,
    )) as PBMUpgradeable;

    const pbmVaultAddress = await pbmContract.vault();
    const pbmVaultContract = (await ethers.getContractAt("PBMVault", pbmVaultAddress)) as PBMVault;

    // Grant PAYEE_ROLE to payees
    const payeeRole = await pbmContract.PAYEE_ROLE();
    await Promise.all(
      payees.map((payee) => pbmContract.connect(admin).grantRole(payeeRole, payee.address)),
    );

    const payments = [
      {
        // Target Status: Withdrawn
        time: 1,
        payer: payer,
        payee: payees[0],
        amount: parseAmount(100),
        lockPeriod: oneDayInterval * 3,
      },
      {
        // Target Status: Matured
        time: oneDayInterval,
        payer: payer,
        payee: payees[0],
        amount: parseAmount(110),
        lockPeriod: oneDayInterval,
      },
      {
        // Target Status: Immediate
        time: oneDayInterval,
        payer: payer,
        payee: payees[1],
        amount: parseAmount(120.12345),
        lockPeriod: 0,
      },
      {
        // Target Status: Withheld
        time: oneDayInterval * 2,
        payer: payer,
        payee: payees[0],
        amount: parseAmount(130.54821),
        lockPeriod: oneDayInterval * 3,
      },
      {
        // Target Status: Withheld
        time: 1,
        payer: payer,
        payee: payees[0],
        amount: parseAmount(140.12345678987654),
        lockPeriod: oneDayInterval * 14,
      },
      {
        // Target Status: Refunded
        time: 1,
        payer: payer,
        payee: payees[0],
        amount: parseAmount(1500.12345),
        lockPeriod: oneDayInterval * 14,
      },
      {
        // Target Status: Withheld left a few minutes
        time: 1,
        payer: payer,
        payee: payees[0],
        amount: parseAmount(160),
        lockPeriod: 60 * 5, // 5 minutes
      },
    ];

    // Sent all payment transactions
    const performTx = async () => {
      const receipts = [];
      for (const payment of payments) {
        await time.increase(payment.time);
        const tx = await pbmContract
          .connect(payment.payer)
          .pay(payment.payee.address, payment.amount, payment.lockPeriod);
        const receipt = await tx.wait();
        receipts.push(receipt);
        console.log(
          `Payment sent: ${payment.amount} PBM to ${payment.payee.address} from ${payment.payer.address} with lock period ${payment.lockPeriod} seconds`,
        );
      }
      return receipts;
    };
    const paymentReceipts = await performTx();

    // Withdraw first payment so that its status will be Withdrawn
    const payment0DepositEvent = getDepositEvent(pbmVaultContract, paymentReceipts[0]);
    const payment0Id = payment0DepositEvent?.args?.depositId;
    if (payment0Id) {
      const withdrawTx = await pbmContract
        .connect(payees[0])
        .withdraw(payees[0].address, [payment0Id]);
      await withdrawTx.wait();
      console.log("Payment0 withdrawn");
    } else {
      throw new Error("Payment0 ID not found");
    }

    // Refund the sixth payment so that its status will be Refunded
    const payment5DepositEvent = getDepositEvent(pbmVaultContract, paymentReceipts[5]);
    const payment5Id = payment5DepositEvent?.args?.depositId;
    if (payment5Id) {
      const chargebackTx = await pbmContract
        .connect(treasurer)
        .chargeback(payees[0].address, payment5Id);
      await chargebackTx.wait();
      console.log("Payment5 refunded");
    } else {
      throw new Error("Payment5 ID not found");
    }

    console.log("All payment transaction fixtures sent!");
  });

const getDepositEvent = (pbmVaultContract: PBMVault, receipt: ContractReceipt) => {
  return receipt.logs
    ?.map((logs) => {
      try {
        return pbmVaultContract.interface.parseLog(logs);
      } catch {
        // Topic does not belong to PBMVault contract
        return null;
      }
    })
    .find((log) => log && log.name === "Deposit");
};
