import { HardhatRuntimeEnvironment } from "hardhat/types";

type Parameters = {
  hre: HardhatRuntimeEnvironment;
  address: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructorArgsParams: any[];
  contract?: string;
};

export const verifyContract = async ({
  hre,
  address,
  constructorArgsParams,
  contract,
}: Parameters) => {
  if (["localhost", "hardhat"].includes(hre.network.name)) {
    console.log(`[Status] Skipped verifying contract ${address} on local`);
    return;
  }
  console.log(`[Status] Verifying contract ${address}...`);
  try {
    await hre.run("verify:verify", {
      address,
      constructorArguments: constructorArgsParams,
      contract,
    });
    console.log(`[Status] Verified contract at ${address}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if ((err.message as string).indexOf("Reason: Already Verified") === -1) {
      throw err;
    }
  }
};
