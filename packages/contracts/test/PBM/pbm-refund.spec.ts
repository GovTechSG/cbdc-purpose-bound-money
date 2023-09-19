import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { assert, expect } from "chai";
import { BigNumber, ContractTransaction, ethers } from "ethers";

import { DSGD, PBM, PBMVault } from "../../types";
import { parseAmount } from "../../common/utils";
import { deployPBMFixture } from "./pbm.fixture";

describe("PBM - Refund", () => {
  let fixtures: Awaited<ReturnType<typeof deployPBMFixture>>;

  let pbmContract: PBM;
  let pbmVaultContract: PBMVault;
  let dsgdContract: DSGD;

  beforeEach(async () => {
    fixtures = await loadFixture(deployPBMFixture);
    pbmContract = fixtures.pbmContract;
    pbmVaultContract = fixtures.pbmVaultContract;
    dsgdContract = fixtures.dsgdContract;
  });

  describe("Refund", () => {
    let payer: SignerWithAddress;
    let payee: SignerWithAddress;

    const amount = parseAmount(500);
    const lockPeriod = 3600 * 24 * 14; // 14 days

    beforeEach(async () => {
      payer = fixtures.signers.payer;
      payee = fixtures.signers.payee;

      // Make a payment
      await pbmContract.connect(payer).pay(payee.address, amount, lockPeriod);
    });

    describe("When payee initiates a refund", () => {
      it("should revert if deposit ID does not exist", async () => {
        const invalidDepositId = 5;

        const tx = pbmContract.connect(payee).refund(invalidDepositId);

        await expect(tx).to.be.revertedWithCustomError(pbmVaultContract, "InvalidDepositIdRange");
      });

      it("should revert if caller is not a whitelisted payee", async () => {
        const nonWhitelistedPayee = fixtures.signers.others[5];

        const tx = pbmContract.connect(nonWhitelistedPayee).refund(0);

        await expect(tx)
          .to.be.revertedWithCustomError(pbmContract, "UnauthorisedCaller")
          .withArgs(nonWhitelistedPayee.address, fixtures.roles.payeeRole);
      });

      describe("When the payment has already matured", () => {
        beforeEach(async () => {
          await time.increase(lockPeriod + 1);
        });

        it("should revert on refund", async () => {
          const tx = pbmContract.connect(payee).refund(0);

          await expect(tx).to.be.revertedWithCustomError(pbmVaultContract, "DepositAlreadyMatured");
        });
      });

      describe("When the payment has not matured", () => {
        let refundTx: ContractTransaction;
        let initialSupply: BigNumber;
        let payerInitialUnderlyingAssetBalance: BigNumber;
        let initialPayeeVPbmBalance: BigNumber;

        beforeEach(async () => {
          initialSupply = await pbmContract.totalSupply();
          payerInitialUnderlyingAssetBalance = await dsgdContract.balanceOf(payer.address);

          // Assert that payee has vPBM tokens before refund
          initialPayeeVPbmBalance = await pbmVaultContract.balanceOf(payee.address);
          assert.equal(initialPayeeVPbmBalance.toString(), amount.toString());

          // Payee initiate refund
          refundTx = await pbmContract.connect(payee).refund(0);
        });

        it("should burn vPBM tokens from payee", async () => {
          const payeeVPbmBalance = await pbmVaultContract.balanceOf(payee.address);

          expect(payeeVPbmBalance).to.equal(0);
          await expect(refundTx)
            .to.emit(pbmVaultContract, "Transfer")
            .withArgs(payee.address, ethers.constants.AddressZero, amount);
        });

        it("should transfer PBM token from vault to payer before burning", async () => {
          await expect(refundTx)
            .to.emit(pbmContract, "Transfer")
            .withArgs(pbmVaultContract.address, payer.address, amount);
        });

        it("should burn the PBM tokens refunded", async () => {
          const newTotalSupply = await pbmContract.totalSupply();
          const supplyDiff = initialSupply.sub(newTotalSupply);

          expect(supplyDiff).to.equal(amount);
          await expect(refundTx)
            .to.emit(pbmContract, "Transfer")
            .withArgs(payer.address, ethers.constants.AddressZero, amount);
        });

        it("should transfer the underlying asset back to payer", async () => {
          const payerNewUnderlyingAssetBalance = await dsgdContract.balanceOf(payer.address);
          const balanceDiff = payerNewUnderlyingAssetBalance.sub(
            payerInitialUnderlyingAssetBalance,
          );

          expect(balanceDiff).to.equal(amount);
          await expect(refundTx)
            .to.emit(dsgdContract, "Transfer")
            .withArgs(pbmContract.address, payer.address, amount);
        });

        it("should revert if a payee refunds another payee's deposit", async () => {
          const anotherPayee = fixtures.signers.others[5];
          await pbmContract
            .connect(fixtures.signers.admin)
            .grantRole(fixtures.roles.payeeRole, anotherPayee.address);

          const tx = pbmContract.connect(anotherPayee).refund(0);

          await expect(tx).to.be.revertedWithCustomError(pbmVaultContract, "InvalidActiveDeposit");
        });

        it("should emit Refund event", async () => {
          await expect(refundTx)
            .to.emit(pbmContract, "Refund")
            .withArgs(0, payee.address, payee.address, payer.address, amount);
        });
      });

      describe("When the contract is paused", () => {
        beforeEach(async () => {
          // Pause contract
          await pbmContract.connect(fixtures.signers.admin).pause();
        });

        it("should revert with paused reason", async () => {
          const tx = pbmContract.connect(payee).refund(0);

          await expect(tx).to.be.revertedWith("Pausable: paused");
        });
      });
    });
  });
});
