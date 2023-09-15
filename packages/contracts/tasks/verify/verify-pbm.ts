import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import { verifyContract } from "../helpers/verify-contract";

type Parameters = TaskArguments;

task("verify:pbm", "Verify PBM token")
  .addParam<string>("address", "Target address to verify")
  .setAction(async function (taskArguments, hre) {
    try {
      const { address } = taskArguments as Parameters;

      console.log(`[Status] Verifying PBM token contract...`);

      await verifyContract({
        address,
        constructorArgsParams: [],
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
