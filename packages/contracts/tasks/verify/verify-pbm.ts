import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import { verifyContract } from "../helpers/verify-contract";

type Parameters = {
  address: string;
  name: string;
  symbol: string;
} & TaskArguments;

task("verify:pbm", "Verify PBM token")
  .addParam<string>("address", "Target address to verify")
  .addParam<string>("name", "PBM token name")
  .addParam<string>("symbol", "PBM token symbol")
  .setAction(async function (taskArguments, hre) {
    try {
      const { address, name, symbol } = taskArguments as Parameters;

      console.log(`[Status] Verifying PBM token contract...`);

      await verifyContract({
        address,
        constructorArgsParams: [name, symbol],
        contract: "contracts/PBMUpgradeable.sol:PBMUpgradeable",
        hre,
      });

      console.log(`[Status] ✅ Verified ${address}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log("[Status] ❌ An error occurred while verifying");
      console.error(err.error?.message ?? err.message);
    }
  });
