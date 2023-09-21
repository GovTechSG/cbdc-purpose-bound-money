import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { assert, expect } from "chai";
import { BigNumber, ContractTransaction } from "ethers";

import { parseAmount } from "../../common/utils";
import { DSGD, PBM } from "../../types";
import { deployPBMFixture } from "./pbm.fixture";

describe("PBM - Redeem", () => {
  let fixtures: Awaited<ReturnType<typeof deployPBMFixture>>;

  let pbmContract: PBM;
  let dsgdContract: DSGD;

  beforeEach(async () => {
    fixtures = await loadFixture(deployPBMFixture);
    pbmContract = fixtures.pbmContract;
    dsgdContract = fixtures.dsgdContract;
  });

  describe("Redeem", async () => {
    let payer: SignerWithAddress;
    let payee: SignerWithAddress;

    const amount = parseAmount(500);

    const testMatrixAutoWithdrawal = [true, false];

    testMatrixAutoWithdrawal.forEach((autoWithdrawal) => {
      describe(`When autoWithdrawal is ${autoWithdrawal}`, () => {
        beforeEach(async () => {
          payer = fixtures.signers.payer;
          payee = fixtures.signers.payee;

          // Make a payment
          await pbmContract.connect(payer).pay(payee.address, amount, 0, autoWithdrawal);
        });

        describe("When the caller is not a whitelisted payee", () => {
          it("should revert with unauthorised call error", async () => {
            const nonAuthorisedPayee = fixtures.signers.others[5];

            const tx = pbmContract.connect(nonAuthorisedPayee).redeem(amount);

            await expect(tx)
              .to.be.revertedWithCustomError(pbmContract, "UnauthorisedCaller")
              .withArgs(nonAuthorisedPayee.address, fixtures.roles.payeeRole);
          });
        });

        describe("When caller is a whitelisted payee", () => {
          describe("When payee redeems more than he has", () => {
            it("should revert with insufficient amount error", async () => {
              const exceedingAmount = amount.add(1);

              const tx = pbmContract.connect(payee).redeem(exceedingAmount);

              await expect(tx).to.be.revertedWith("ERC20: burn amount exceeds balance");
            });
          });

          describe("When the payee has sufficient PBM to redeem", () => {
            let redeemTx: ContractTransaction;
            let payeeInitialPbmBalance: BigNumber;

            beforeEach(async () => {
              payeeInitialPbmBalance = await pbmContract.balanceOf(payee.address);
              assert.equal(payeeInitialPbmBalance.toString(), amount.toString());

              const payeeDsgdBalance = await dsgdContract.balanceOf(payee.address);
              assert.equal(payeeDsgdBalance.toString(), "0");

              const pbmTotalSupply = await pbmContract.totalSupply();
              assert.equal(pbmTotalSupply.toString(), amount.toString());

              redeemTx = await pbmContract.connect(payee).redeem(amount);
            });

            it("should burn callers PBM tokens", async () => {
              const payeeNewPbmBalance = await pbmContract.balanceOf(payee.address);

              expect(payeeNewPbmBalance).to.equal(0);
            });

            it("should unwrap PBM to underlying asset and transfer to payee", async () => {
              const payeeDsgdBalance = await dsgdContract.balanceOf(payee.address);

              expect(payeeDsgdBalance).to.equal(amount);
            });

            it("should reduce the supply of PBM", async () => {
              const pbmTotalSupply = await pbmContract.totalSupply();

              expect(pbmTotalSupply).to.equal(0);
            });

            it("should emit Redemption event", async () => {
              await expect(redeemTx)
                .to.emit(pbmContract, "Redemption")
                .withArgs(payee.address, amount);
            });
          });
        });

        describe("When the contract is paused", () => {
          beforeEach(async () => {
            // Pause contract
            await pbmContract.connect(fixtures.signers.admin).pause();
          });

          it("should revert with paused reason", async () => {
            const tx = pbmContract.connect(payee).redeem(amount);

            await expect(tx).to.be.revertedWith("Pausable: paused");
          });
        });
      });
    });
  });
});
