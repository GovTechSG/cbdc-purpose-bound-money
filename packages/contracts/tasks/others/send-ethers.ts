import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import { parseAmount } from "../../test/utils";

type DeployPaymentFixturesArguments = {
  pbm: string;
} & TaskArguments;

task("send:ethers", "Send Ethers")
  .addParam<string>("to", "Recipient address")
  .addParam<number>("amount", "Amount of Ethers")
  .setAction(async function (taskArguments: DeployPaymentFixturesArguments, { ethers }) {
    // Default is deployer account
    const [signer] = await ethers.getSigners();

    const amount = parseAmount(taskArguments.amount, 18);

    const tx = await signer.sendTransaction({ to: taskArguments.to, value: amount });
    const receipt = await tx.wait();

    console.log(
      `Sent ${taskArguments.amount} ETH to ${taskArguments.to} in tx ${receipt.transactionHash}`,
    );
  });
