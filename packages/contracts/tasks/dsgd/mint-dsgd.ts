import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import { parseAmount } from "../../common/utils";
import { DSGD } from "../../types";
import { getDefaultSigner } from "../helpers/default-signer";

type DeployPaymentFixturesArguments = {
  pbm: string;
} & TaskArguments;

task("dsgd:mint", "Mint DSGD")
  .addParam<string>("dsgd", "DSGD address")
  .addParam<string>("to", "Recipient address")
  .addParam<number>("amount", "Amount of DSGD")
  .setAction(async function (taskArguments: DeployPaymentFixturesArguments, { ethers }) {
    // Get default signer
    const signer = await getDefaultSigner(ethers);

    const dsgdContract = (await ethers.getContractAt("DSGD", taskArguments.dsgd)) as DSGD;
    const decimals = await dsgdContract.decimals();

    const amount = parseAmount(taskArguments.amount, decimals);

    const tx = await dsgdContract.connect(signer).mint(taskArguments.to, amount);
    const receipt = await tx.wait();

    console.log(
      `Minted ${taskArguments.amount} DSGD to ${signer.address} in tx ${receipt.transactionHash}`,
    );
  });
