import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";

import { DSGD, PBMUpgradeable } from "../../types";
import { parseAmount } from "../../common/utils";
import { PBMFixtureParamType, deployPBMFixture } from "./pbm.fixture";

describe("PBM - Setup", () => {
  let fixtures: Awaited<ReturnType<typeof deployPBMFixture>>;

  let pbmContract: PBMUpgradeable;
  let dsgdContract: DSGD;

  let pbmParams: PBMFixtureParamType;
  let deployer: SignerWithAddress;

  beforeEach(async () => {
    fixtures = await loadFixture(deployPBMFixture);
    pbmContract = fixtures.pbmContract;
    dsgdContract = fixtures.dsgdContract;

    deployer = fixtures.signers.deployer;

    pbmParams = fixtures.pbmDefaultParams;
  });

  describe("Setup", function () {
    describe("Admin Roles", () => {
      it("should grant deployer as admin", async () => {
        const adminRole = await pbmContract.DEFAULT_ADMIN_ROLE();
        const res = await pbmContract.hasRole(adminRole, deployer.address);

        expect(res).to.be.true;
      });

      it("should grant deployer as treasurer", async () => {
        const treasurerRole = await pbmContract.TREASURER_ROLE();
        const res = await pbmContract.hasRole(treasurerRole, deployer.address);

        expect(res).to.be.true;
      });

      it("should grant deployer as payee", async () => {
        const payeeRole = await pbmContract.PAYEE_ROLE();
        const res = await pbmContract.hasRole(payeeRole, deployer.address);

        expect(res).to.be.true;
      });
    });

    describe("Token Setup", () => {
      it("should have the correct token name", async () => {
        const res = await pbmContract.name();

        expect(res).to.be.equal(pbmParams.name);
      });

      it("should have the correct token symbol", async () => {
        const res = await pbmContract.symbol();

        expect(res).to.be.equal(pbmParams.symbol);
      });

      it("should have the correct decimals", async () => {
        const dsgdDecimals = await dsgdContract.decimals();
        const pbmDecimals = await pbmContract.decimals();

        expect(pbmDecimals).to.be.equal(dsgdDecimals);
      });
    });

    describe("Underlying Asset", () => {
      it("should return the correct asset address", async () => {
        it("should have the correct asset", async () => {
          const res = await pbmContract.asset();

          expect(res).to.be.equal(dsgdContract.address);
        });
      });

      it("should return the correct total asset balance", async () => {
        await dsgdContract.mint(pbmContract.address, parseAmount(8888));

        const res = await pbmContract.totalAsset();

        expect(res.toString()).to.be.equal(parseAmount(8888).toString());
      });
    });

    describe("Proxy Setup", () => {
      describe("When upgrading the contract", () => {
        let newPbmContract: PBMUpgradeable;

        beforeEach(async () => {
          newPbmContract = (await (
            await ethers.getContractFactory("PBMUpgradeable")
          ).deploy()) as PBMUpgradeable;
        });

        describe("When caller to upgrade is not an admin", () => {
          it("should revert if caller is not an admin", async () => {
            const nonAdminSigner = fixtures.signers.others[0];

            const tx = pbmContract.connect(nonAdminSigner).upgradeTo(newPbmContract.address);

            await expect(tx)
              .to.be.revertedWithCustomError(pbmContract, "UnauthorisedCaller")
              .withArgs(nonAdminSigner.address, fixtures.roles.adminRole);
          });
        });

        describe("When caller to upgrade is an admin", () => {
          it("should revert when attempt to re-initialise", async () => {
            const upgradeData = newPbmContract.interface.encodeFunctionData("initialize", [
              pbmParams.name,
              pbmParams.symbol,
              dsgdContract.address,
              pbmParams.vault,
            ]);

            const tx = pbmContract
              .connect(fixtures.signers.admin)
              .upgradeToAndCall(newPbmContract.address, upgradeData);

            await expect(tx).to.be.revertedWith("Initializable: contract is already initialized");
          });

          it("should upgrade to new contract if caller is an admin", async () => {
            const tx = pbmContract
              .connect(fixtures.signers.admin)
              .upgradeTo(newPbmContract.address);

            await expect(tx).to.not.be.reverted;
          });
        });
      });
    });
  });
});
