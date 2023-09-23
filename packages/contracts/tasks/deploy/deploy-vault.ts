import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import { deployUpgradeableContract } from "../../common/utils";
import { PBMVault__factory } from "../../types";
import { getDefaultSigner } from "../helpers/default-signer";
import { wait } from "../helpers/wait";

type Parameters = {
  name: string;
  symbol: string;
  noProxy: boolean;
} & TaskArguments;

task("deploy:vault", "Deploy PBM vault")
  .addParam<string>("name", "Vaulted token name")
  .addParam<string>("symbol", "Vaulted token symbol")
  .addFlag("noProxy", "Deploy without proxy")
  .setAction(async function (taskArguments: Parameters, hre) {
    const { ethers } = hre;
    try {
      const { name, symbol, noProxy } = taskArguments;

      const deployer = await getDefaultSigner(ethers);
      const deployerAddress = await deployer.getAddress();

      console.log(`[Deployer] ${deployerAddress}`);

      console.log(`[Status] Deploying PBMVault implementation...`);
      const pbmVaultFactory = (await ethers.getContractFactory("PBMVault")) as PBMVault__factory;
      const pbmVaultImpl = await pbmVaultFactory.connect(deployer).deploy(name, symbol);

      const pbmVaultImplTx = pbmVaultImpl.deployTransaction;
      console.log(`[Transaction] Pending ${pbmVaultImplTx.hash}`);

      await pbmVaultImpl.deployed();
      console.log(`[Address] PBMVault implementation deployed at ${pbmVaultImpl.address}`);

      await wait(3000);

      if (!noProxy) {
        console.log(`[Status] Deploying PBMVault proxy...`);
        const pbmVaultProxyData = pbmVaultImpl.interface.encodeFunctionData("initialize", [
          name,
          symbol,
        ]);
        const pbmVaultContract = await deployUpgradeableContract(
          {
            deployer,
            contract: pbmVaultImpl,
            data: pbmVaultProxyData,
          },
          ethers,
        );
        console.log(`[Address] PBMVault proxy deployed at ${pbmVaultContract.address}`);
      }

      console.log(`[Status] ✅ Deployment for PBMVault completed`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log("[Status] ❌ An error occurred while deploying PBMVault");
      console.error(err.error?.message ?? err.message);
    }
  });
