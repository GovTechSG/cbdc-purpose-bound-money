import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import { verifyContract } from "../helpers/verify-contract";

type Parameters = {
  address: string;
  pbm: string;
  automate: string;
  fundsOwner: string;
} & TaskArguments;

task("verify:taskmanager", "Verify PBMTaskManager")
  .addParam<string>("address", "Target address to verify")
  .addParam<string>("pbm", "Address of PBM")
  .addParam<string>("automate", "Gelato automate address")
  .addParam<string>("fundsOwner", "Funds owner address")
  .setAction(async function (taskArguments, hre) {
    try {
      const { address, pbm, automate, fundsOwner } = taskArguments as Parameters;

      console.log(`[Status] Verifying PBMTaskManager contract...`);

      await verifyContract({
        address,
        constructorArgsParams: [pbm, automate, fundsOwner],
        contract: "contracts/utils/PBMTaskManager.sol:PBMTaskManager",
        hre,
      });

      console.log(`[Status] ✅ Verified ${address}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log("[Status] ❌ An error occurred while verifying");
      console.error(err.error?.message ?? err.message);
    }
  });
