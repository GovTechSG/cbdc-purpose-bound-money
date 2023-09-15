import { time } from "@nomicfoundation/hardhat-network-helpers";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import { deployPBMFixture } from "../../test/PBM/pbm.fixture";

task("fixtures:deploy-pbm", "Deploy PBM fixtures").setAction(async function (
  taskArguments: TaskArguments,
  { ethers },
) {
  await time.setNextBlockTimestamp(Math.floor(Date.now() / 1000));
  const fixtures = await deployPBMFixture({}, ethers);

  console.log("All PBM fixtures deployed!");
  console.table([
    {
      Contract: "PBM",
      Address: fixtures.pbmContract.address,
    },
    {
      Contract: "PBM Vault",
      Address: fixtures.pbmVaultContract.address,
    },
    {
      Contract: "DSGD",
      Address: fixtures.dsgdContract.address,
    },
  ]);
  console.table([
    {
      "Account Role": "Deployer",
      Address: fixtures.signers.deployer.address,
    },
    {
      "Account Role": "Admin",
      Address: fixtures.signers.admin.address,
    },
    {
      "Account Role": "Payer",
      Address: fixtures.signers.payer.address,
    },
    {
      "Account Role": "Payee",
      Address: fixtures.signers.payee.address,
    },
    {
      "Account Role": "Treasurer",
      Address: fixtures.signers.treasurer.address,
    },
  ]);
});
