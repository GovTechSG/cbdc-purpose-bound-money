import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import { PBMVault__factory } from "../../types";
import { verifyContract } from "../helpers/verify-contract";

type Parameters = {
  address: string;
  name: string;
  symbol: string;
  implementation: string;
} & TaskArguments;

task("verify:vault:proxy", "Verify PBM vault")
  .addParam<string>("address", "Target address to verify")
  .addParam<string>("implementation", "Implementation contract address")
  .addParam<string>("name", "Vault token name")
  .addParam<string>("symbol", "Vault token symbol")
  .setAction(async function (taskArguments, hre) {
    try {
      const { address, name, symbol, implementation } = taskArguments as Parameters;

      console.log(`[Status] Verifying PBMVault proxy contract...`);

      const pbmVaultProxyData = PBMVault__factory.createInterface().encodeFunctionData(
        "initialize",
        [name, symbol],
      );
      await verifyContract({
        address,
        constructorArgsParams: [implementation, pbmVaultProxyData],
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
