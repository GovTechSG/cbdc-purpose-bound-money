import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import { deployUpgradeableContract } from "../../common/utils";
import { PBMUpgradeable__factory } from "../../types";
import { getDefaultSigner } from "../helpers/default-signer";
import { wait } from "../helpers/wait";

type Parameters = {
  name: string;
  symbol: string;
  asset: string;
  vault: string;
  noProxy: boolean;
} & TaskArguments;

task("deploy:pbm", "Deploy PBM token")
  .addParam<string>("name", "PBM token name")
  .addParam<string>("symbol", "PBM token symbol")
  .addParam<string>("asset", "Underlying asset address")
  .addParam<string>("vault", "PBM Vault address")
  .addFlag("noProxy", "Deploy without proxy")
  .setAction(async function (taskArguments: Parameters, hre) {
    const { ethers } = hre;
    try {
      const { name, symbol, asset, vault, noProxy } = taskArguments;

      const deployer = await getDefaultSigner(ethers);
      const deployerAddress = await deployer.getAddress();

      console.log(`[Deployer] ${deployerAddress}`);

      console.log(`[Status] Deploying PBM token implementation...`);
      const pbmFactory = (await ethers.getContractFactory(
        "PBMUpgradeable",
      )) as PBMUpgradeable__factory;
      const pbmImpl = await pbmFactory.connect(deployer).deploy();

      const pbmImplTx = pbmImpl.deployTransaction;
      console.log(`[Transaction] Pending ${pbmImplTx.hash}`);

      await pbmImpl.deployed();
      console.log(`[Address] PBM token implementation deployed at ${pbmImpl.address}`);

      await wait(3000);

      console.log(`[Status] Initialising PBM token implementation...`);
      const pbmImplSealTx = await pbmImpl.initialize(
        name,
        symbol,
        pbmImpl.address,
        ethers.constants.AddressZero,
      );
      console.log(`[Transaction] Pending ${pbmImplSealTx.hash}`);
      console.log(`[Status] PBM token implementation initialised`);

      if (!noProxy) {
        console.log(`[Status] Deploying PBM token proxy...`);
        const pbmProxyData = pbmImpl.interface.encodeFunctionData("initialize", [
          name,
          symbol,
          asset,
          vault,
        ]);
        const pbmContract = await deployUpgradeableContract(
          {
            deployer,
            contract: pbmImpl,
            data: pbmProxyData,
          },
          ethers,
        );
        console.log(`[Address] PBM token proxy deployed at ${pbmContract.address}`);
      }

      console.log(`[Status] ✅ Deployment for PBM token completed`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log("[Status] ❌ An error occurred while deploying PBM token");
      console.error(err.error?.message ?? err.message);
    }
  });
