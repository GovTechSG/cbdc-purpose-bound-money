import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import { parseAmount } from "../../test/utils";
import { DSGD } from "../../types";

type DeployPaymentFixturesArguments = {
  pbm: string;
} & TaskArguments;

task("dsgd:mint", "Mint DSGD")
  .addParam<string>("dsgd", "DSGD address")
  .addParam<string>("to", "Recipient address")
  .addParam<number>("amount", "Amount of DSGD")
  .setAction(async function (taskArguments: DeployPaymentFixturesArguments, { ethers }) {
    // Default is deployer account
    const [signer] = await ethers.getSigners();

    const dsgdContract = (await ethers.getContractAt("DSGD", taskArguments.dsgd)) as DSGD;
    const decimals = await dsgdContract.decimals();

    const amount = parseAmount(taskArguments.amount, decimals);

    const tx = await dsgdContract.connect(signer).mint(taskArguments.to, amount);
    const receipt = await tx.wait();

    console.log(
      `Minted ${taskArguments.amount} DSGD to ${signer.address} in tx ${receipt.transactionHash}`,
    );
  });
