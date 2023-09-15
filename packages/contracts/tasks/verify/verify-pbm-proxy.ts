import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import { PBMUpgradeable__factory } from "../../types";
import { verifyContract } from "../helpers/verify-contract";

type Parameters = {
  address: string;
  name: string;
  symbol: string;
  implementation: string;
} & TaskArguments;

task("verify:pbm:proxy", "Verify PBM token")
  .addParam<string>("address", "Target address to verify")
  .addParam<string>("implementation", "Implementation contract address")
  .addParam<string>("name", "PBM token name")
  .addParam<string>("symbol", "PBM token symbol")
  .addParam<string>("asset", "Underlying asset address")
  .addParam<string>("vault", "PBM Vault address")
  .setAction(async function (taskArguments, hre) {
    try {
      const { address, name, symbol, asset, vault, implementation } = taskArguments as Parameters;

      console.log(`[Status] Verifying PBM proxy contract...`);

      const pbmProxyData = PBMUpgradeable__factory.createInterface().encodeFunctionData(
        "initialize",
        [name, symbol, asset, vault],
      );
      await verifyContract({
        address,
        constructorArgsParams: [implementation, pbmProxyData],
        contract: "contracts/lib/proxy/ERC1967Proxy.sol:ERC1967Proxy",
        hre,
      });

      console.log(`[Status] ✅ Verified ${address}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log("[Status] ❌ An error occurred while verifying");
      console.error(err.error?.message ?? err.message);
    }
  });
