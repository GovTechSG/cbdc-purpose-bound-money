import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { assert, expect } from "chai";
import { BigNumber } from "ethers";

import { DSGD, PBM } from "../../types";
import { parseAmount } from "../../common/utils";
import { deployPBMFixture } from "./pbm.fixture";

describe("PBM - Recover", () => {
  let fixtures: Awaited<ReturnType<typeof deployPBMFixture>>;

  let pbmContract: PBM;
  let dsgdContract: DSGD;

  beforeEach(async () => {
    fixtures = await loadFixture(deployPBMFixture);
    pbmContract = fixtures.pbmContract;
    dsgdContract = fixtures.dsgdContract;
  });

  describe("Recover", async () => {
    let admin: SignerWithAddress;
    let adminRecipient: SignerWithAddress;

    const amount = parseAmount(500);

    beforeEach(async () => {
      admin = fixtures.signers.admin;
      adminRecipient = fixtures.signers.others[0];

      // Grant recipient admin
      await pbmContract.connect(admin).grantRole(fixtures.roles.adminRole, adminRecipient.address);

      // Mint send some extra underlying asset to contract
      await dsgdContract.connect(fixtures.signers.deployer).mint(pbmContract.address, amount);
      const pbmDsgdBalance = await dsgdContract.balanceOf(pbmContract.address);
      assert.equal(pbmDsgdBalance.toString(), amount.toString());
    });

    describe("When PBM tokens and underlying assets are not in parity", () => {
      it("should reflect the difference in their total supplies", async () => {
        const pbmTotalSupply = await pbmContract.totalSupply();
        const underlyingAssetSupply = await pbmContract.totalAsset();

        const difference = underlyingAssetSupply.sub(pbmTotalSupply);

        expect(difference.toString()).to.equal(amount.toString());
      });

      describe("When recovering the PBM tokens to parity", () => {
        describe("When caller is not an admin", () => {
          it("should revert if caller is not an admin", async () => {
            const nonAdminCaller = fixtures.signers.others[5];

            const tx = pbmContract.connect(nonAdminCaller).recover(adminRecipient.address);

            await expect(tx)
              .to.be.revertedWithCustomError(pbmContract, "UnauthorisedCaller")
              .withArgs(nonAdminCaller.address, fixtures.roles.adminRole);
          });
        });

        describe("When caller is an admin", () => {
          describe("When recovery recipient is not an admin", () => {
            it("should revert with no admin role error", async () => {
              const nonAdminRecipient = fixtures.signers.others[5];

              const tx = pbmContract.connect(admin).recover(nonAdminRecipient.address);

              await expect(tx)
                .to.be.revertedWithCustomError(pbmContract, "AccountHasNoRole")
                .withArgs(nonAdminRecipient.address, fixtures.roles.adminRole);
            });
          });

          describe("When recovery recipient is an admin", () => {
            let initialRecipientPbmBalance: BigNumber;

            beforeEach(async () => {
              // Retrieve initial recipient PBM balance
              initialRecipientPbmBalance = await pbmContract.balanceOf(adminRecipient.address);
              assert.equal(initialRecipientPbmBalance.toString(), "0");

              // Assert that initial asset and PBM supplies are not in parity
              const pbmTotalSupply = await pbmContract.totalSupply();
              const underlyingAssetSupply = await pbmContract.totalAsset();
              assert.notEqual(pbmTotalSupply.toString(), underlyingAssetSupply.toString());
            });

            it("should mint excess PBM token to recipient to parity", async () => {
              await pbmContract.connect(admin).recover(adminRecipient.address);
              const newRecipientPbmBalance = await pbmContract.balanceOf(adminRecipient.address);

              expect(newRecipientPbmBalance.toString()).to.equal(amount.toString());
            });

            it("should have equal underlying asset and PBM total supplies", async () => {
              await pbmContract.connect(admin).recover(adminRecipient.address);
              const newPbmTotalSupply = await pbmContract.totalSupply();
              const newUnderlyingAssetSupply = await pbmContract.totalAsset();

              expect(newPbmTotalSupply.toString()).to.equal(newUnderlyingAssetSupply.toString());
            });
          });
        });
      });
    });

    describe("When PBM tokens and underlying asset are already in parity", () => {
      describe("When attempt to still recover the PBM tokens to parity", () => {
        let parityPbmTotalSupply: BigNumber;
        let parityRecipientPbmBalance: BigNumber;

        beforeEach(async () => {
          // To assert that PBM and underlying asset are in parity
          await pbmContract.connect(admin).recover(adminRecipient.address);
          const pbmTotalSupply = await pbmContract.totalSupply();
          const underlyingAssetSupply = await pbmContract.totalAsset();
          assert.equal(pbmTotalSupply.toString(), underlyingAssetSupply.toString());

          parityPbmTotalSupply = pbmTotalSupply;
          parityRecipientPbmBalance = await pbmContract.balanceOf(adminRecipient.address);

          // Purposefully recover once more
          await pbmContract.connect(admin).recover(adminRecipient.address);
        });

        it("should not mint extra PBM supplies", async () => {
          const newPbmTotalSupply = await pbmContract.totalSupply();

          expect(newPbmTotalSupply.toString()).to.equal(parityPbmTotalSupply.toString());
        });

        it("should not mint extra PBM tokens to recipient", async () => {
          const newRecipientPbmBalance = await pbmContract.balanceOf(adminRecipient.address);

          expect(newRecipientPbmBalance.toString()).to.equal(parityRecipientPbmBalance.toString());
        });
      });
    });

    describe("When contract is paused", () => {
      beforeEach(async () => {
        // Pause the contract
        await pbmContract.connect(admin).pause();
      });

      it("should revert with paused reason", async () => {
        const tx = pbmContract.connect(admin).recover(adminRecipient.address);

        await expect(tx).to.be.revertedWith("Pausable: paused");
      });
    });
  });
});
