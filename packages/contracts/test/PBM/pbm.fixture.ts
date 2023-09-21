import { assert } from "chai";

import { HardhatEthers } from "../../common/types";
import { deployUpgradeableContract, parseAmount, resolveEthers } from "../../common/utils";
import {
  DSGD__factory,
  MockPBMTaskManager__factory,
  PBMUpgradeable__factory,
  PBMVault__factory,
} from "../../types";

export type PBMFixtureParamType = {
  name: string;
  symbol: string;
  asset: string;
  vault: string;
};

export async function deployPBMFixture(
  params?: Partial<PBMFixtureParamType>,
  ethers?: HardhatEthers,
) {
  ethers = await resolveEthers(ethers);
  const [deployer, admin, payer, payee, treasurer, ...signers] = await ethers.getSigners();

  // Deploy DSGD
  const dsgdFactory = (await ethers.getContractFactory("DSGD")) as DSGD__factory;
  const dsgdContract = await dsgdFactory.connect(deployer).deploy();
  await dsgdContract.deployed();

  // Initialise PBM default parameters
  const pbmDefaultParams: PBMFixtureParamType = {
    name: "Purpose-Bound Money",
    symbol: "PBM",
    asset: dsgdContract.address,
    vault: "",
    ...params,
  };

  // Deploy Vault
  const pbmVaultFactory = (await ethers.getContractFactory("PBMVault")) as PBMVault__factory;
  const pbmVaultImpl = await pbmVaultFactory.connect(deployer).deploy();
  await pbmVaultImpl.deployed();
  const pbmVaultContract = await deployUpgradeableContract(
    {
      deployer,
      contract: pbmVaultImpl,
      data: pbmVaultImpl.interface.encodeFunctionData("initialize", [
        `v${pbmDefaultParams.name}`,
        `v${pbmDefaultParams.symbol}`,
      ]),
    },
    ethers,
  );

  pbmDefaultParams.vault = pbmVaultContract.address;

  // Deploy PBM
  const pbmFactory = (await ethers.getContractFactory("PBMUpgradeable")) as PBMUpgradeable__factory;
  const pbmImpl = await pbmFactory.connect(deployer).deploy();
  await pbmImpl.deployed();
  const pbmContract = await deployUpgradeableContract(
    {
      deployer,
      contract: pbmImpl,
      data: pbmImpl.interface.encodeFunctionData("initialize", [
        pbmDefaultParams.name,
        pbmDefaultParams.symbol,
        pbmDefaultParams.asset,
        pbmDefaultParams.vault,
      ]),
    },
    ethers,
  );

  // Deploy Mock PBM Task Manager
  const mockPbmTaskManagerFactory = (await ethers.getContractFactory(
    "MockPBMTaskManager",
  )) as MockPBMTaskManager__factory;
  const mockPbmTaskManagerContract = await mockPbmTaskManagerFactory.connect(deployer).deploy();
  await mockPbmTaskManagerContract.deployed();

  // Set PBM address to Vault
  const setPbmTx = await pbmVaultContract.connect(deployer).setPBM(pbmContract.address);
  await setPbmTx.wait();

  // Retrieve roles
  const [adminRole, payerRole, payeeRole, treasurerRole] = await Promise.all([
    pbmContract.DEFAULT_ADMIN_ROLE(),
    pbmContract.PAYER_ROLE(),
    pbmContract.PAYEE_ROLE(),
    pbmContract.TREASURER_ROLE(),
  ]);

  // Setup admin role
  const grantRoleTx = await pbmContract.connect(deployer).grantRole(adminRole, admin.address);
  await grantRoleTx.wait();

  // Setup treasurer role and whitelist payee
  const adminNonce = await ethers.provider.getTransactionCount(admin.address, "latest");

  const grantTxs = await Promise.all([
    pbmContract.connect(admin).grantRole(payerRole, payer.address, { nonce: adminNonce }),
    pbmContract.connect(admin).grantRole(payeeRole, payee.address, { nonce: adminNonce + 1 }),
    pbmContract
      .connect(admin)
      .grantRole(treasurerRole, treasurer.address, { nonce: adminNonce + 2 }),
  ]);
  await Promise.all(grantTxs.map((tx) => tx.wait()));

  // Mint some DSGD to payer
  const payerFunds = parseAmount(50000);
  const mintTx = await dsgdContract.connect(deployer).mint(payer.address, payerFunds);
  await mintTx.wait();
  const payerDsgdBalance = await dsgdContract.balanceOf(payer.address);
  assert.equal(payerDsgdBalance.toString(), payerFunds.toString());

  // Approvals
  const approveTxs = await Promise.all([
    dsgdContract.connect(deployer).approve(pbmContract.address, ethers.constants.MaxUint256),
    dsgdContract.connect(admin).approve(pbmContract.address, ethers.constants.MaxUint256),
    dsgdContract.connect(payer).approve(pbmContract.address, ethers.constants.MaxUint256),
  ]);
  await Promise.all(approveTxs.map((tx) => tx.wait()));

  return {
    pbmContract,
    pbmVaultContract,
    pbmDefaultParams,
    dsgdContract,
    mockPbmTaskManagerContract,

    signers: {
      deployer,
      admin,
      payer,
      payee,
      treasurer,
      others: signers,
    },

    roles: {
      adminRole,
      payerRole,
      payeeRole,
      treasurerRole,
    },
  };
}
