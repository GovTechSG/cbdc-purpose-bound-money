import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import { PBMTaskManager__factory } from "../../types";
import { getDefaultSigner } from "../helpers/default-signer";

type Parameters = {
  pbm: string;
  automate: string;
  fundsOwner: string;
} & TaskArguments;

task("deploy:taskmanager", "Deploy PBMTaskManager")
  .addParam<string>("pbm", "Address of PBM")
  .addParam<string>("automate", "Gelato automate address")
  .addParam<string>("fundsOwner", "Funds owner address")
  .setAction(async function (taskArguments: Parameters, hre) {
    const { ethers } = hre;
    try {
      const { pbm, automate, fundsOwner } = taskArguments;

      const deployer = await getDefaultSigner(ethers);
      const deployerAddress = await deployer.getAddress();

      console.log(`[Deployer] ${deployerAddress}`);

      console.log(`[Status] Deploying PBMTaskManager...`);
      const pbmTaskManagerFactory = (await ethers.getContractFactory(
        "PBMTaskManager",
      )) as PBMTaskManager__factory;
      const pbmTaskManager = await pbmTaskManagerFactory
        .connect(deployer)
        .deploy(pbm, automate, fundsOwner);

      const pbmTaskManagerTx = pbmTaskManager.deployTransaction;
      console.log(`[Transaction] Pending ${pbmTaskManagerTx.hash}`);

      await pbmTaskManager.deployed();
      console.log(`[Address] PBMTaskManager deployed at ${pbmTaskManager.address}`);

      console.log(`[Status] ✅ Deployment for PBMTaskManager completed`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log("[Status] ❌ An error occurred while deploying PBMTaskManager");
      console.error(err.error?.message ?? err.message);
    }
  });
