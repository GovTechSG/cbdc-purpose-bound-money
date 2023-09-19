import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { assert, expect } from "chai";
import { BigNumber, ContractTransaction, constants } from "ethers";

import { DSGD, PBM, PBMVault } from "../../types";
import { parseAmount } from "../../common/utils";
import { deployPBMFixture } from "./pbm.fixture";

describe("PBM - Withdraw", () => {
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

  describe("Withdraw", () => {
    let payer: SignerWithAddress;
    let payee: SignerWithAddress;
    let executor: SignerWithAddress;

    const lockPeriod = 60 * 60 * 24 * 14; // 14 days

    beforeEach(async () => {
      payer = fixtures.signers.payer;
      payee = fixtures.signers.payee;
      executor = fixtures.signers.others[0];
    });

    describe("When withdrawing a payment", () => {
      let paidAmount: BigNumber;
      let payeeActiveDepositIds: BigNumber[];

      beforeEach(async () => {
        paidAmount = parseAmount(100);

        // Make some payments to payee
        await pbmContract.connect(payer).pay(payee.address, paidAmount, lockPeriod);

        // Get payee's payment ids
        payeeActiveDepositIds = await pbmVaultContract.getActiveDepositIds(payee.address);

        assert.equal(payeeActiveDepositIds.length, 1);
      });

      describe("When the deposit has not matured", () => {
        it("should revert if payee attempts to withdraw", async () => {
          const tx = pbmContract.connect(payee).withdraw(payee.address, payeeActiveDepositIds);

          await expect(tx).to.be.revertedWithCustomError(pbmVaultContract, "DepositNotMatured");
        });

        it("should revert if executor attempts to withdraw", async () => {
          const tx = pbmContract.connect(executor).withdraw(payee.address, payeeActiveDepositIds);

          await expect(tx).to.be.revertedWithCustomError(pbmVaultContract, "DepositNotMatured");
        });
      });

      describe("When the deposit has matured", () => {
        beforeEach(async () => {
          await time.increase(lockPeriod);
        });

        describe("When withdrawing the deposit", () => {
          it("should allow payee to withdraw successfully", async () => {
            const withdrawTx = pbmContract
              .connect(payee)
              .withdraw(payee.address, payeeActiveDepositIds);

            await expect(withdrawTx).to.not.be.reverted;
          });

          it("should allow anyone to withdraw behalf of the payee's deposit", async () => {
            const withdrawTx = pbmContract
              .connect(executor)
              .withdraw(payee.address, payeeActiveDepositIds);

            await expect(withdrawTx).to.not.be.reverted;
          });

          describe("When the deposit has been withdrawn", () => {
            let initialPayeePbmBalance: BigNumber;
            let initialPbmUnderlyingAssetBalance: BigNumber;
            let withdrawTx: ContractTransaction;

            beforeEach(async () => {
              initialPayeePbmBalance = await pbmContract.balanceOf(payee.address);
              assert.equal(
                initialPayeePbmBalance.toString(),
                "0",
                "Payee initial PBM balance should be 0",
              );

              // Get initial asset balance in PBM contract
              initialPbmUnderlyingAssetBalance = await dsgdContract.balanceOf(pbmContract.address);

              // Initiates withdrawal on payee's deposit
              withdrawTx = await pbmContract
                .connect(executor)
                .withdraw(payee.address, payeeActiveDepositIds);
            });

            it("should not withdraw the underlying asset", async () => {
              const pbmUnderlyingAssetBalance = await dsgdContract.balanceOf(pbmContract.address);

              expect(pbmUnderlyingAssetBalance).to.equal(initialPbmUnderlyingAssetBalance);
            });

            it("should set the deposit as inactive", async () => {
              const isActive = await pbmVaultContract.isDepositActive(
                payee.address,
                payeeActiveDepositIds[0],
              );

              expect(isActive).to.be.false;
            });

            it("should not reduce the payee's total deposits", async () => {
              // To ensure matured deposits are kept
              const res = await pbmVaultContract.totalDepositsOf(payee.address);

              expect(res).to.equal(1);
            });

            it("should burn vPBM from payee", async () => {
              const payeeVPbmBalance = await pbmVaultContract.balanceOf(payee.address);

              expect(payeeVPbmBalance).to.equal(0);
              await expect(withdrawTx)
                .to.emit(pbmVaultContract, "Transfer")
                .withArgs(payee.address, constants.AddressZero, paidAmount);
            });

            it("should transfer PBM token to payee", async () => {
              const payeePbmBalance = await pbmContract.balanceOf(payee.address);

              expect(payeePbmBalance).to.equal(paidAmount);
              await expect(withdrawTx)
                .to.emit(pbmContract, "Transfer")
                .withArgs(pbmVaultContract.address, payee.address, paidAmount);
            });

            it("should not transfer PBM token to PBM contract", async () => {
              const pbmContractPbmBalance = await pbmContract.balanceOf(pbmContract.address);

              expect(pbmContractPbmBalance).to.equal(0);
            });

            it("should not transfer PBM token to payer", async () => {
              const payerPbmBalance = await pbmContract.balanceOf(payer.address);

              expect(payerPbmBalance).to.equal(0);
            });

            it("should not transfer PBM token to executor", async () => {
              const executorPbmBalance = await pbmContract.balanceOf(executor.address);

              expect(executorPbmBalance).to.equal(0);
            });

            it("should reduce vault's PBM balance", async () => {
              const vaultPbmBalance = await pbmContract.balanceOf(pbmVaultContract.address);

              expect(vaultPbmBalance).to.equal(0);
            });

            it("should revert if withdraw an inactive (already withdrawn) deposit", async () => {
              const tx = pbmContract.connect(payee).withdraw(payee.address, payeeActiveDepositIds);

              await expect(tx).to.be.revertedWithCustomError(
                pbmVaultContract,
                "InvalidActiveDeposit",
              );
            });

            it("should emit Withdrawal event from the vault", async () => {
              await expect(withdrawTx)
                .to.emit(pbmVaultContract, "Withdrawal")
                .withArgs(payeeActiveDepositIds[0], payee.address, payee.address, paidAmount, true);
            });
          });
        });
      });

      describe("When the contract is paused", () => {
        beforeEach(async () => {
          // Pause contract
          await pbmContract.connect(fixtures.signers.admin).pause();
        });

        it("should revert with paused reason", async () => {
          const tx = pbmContract.connect(payee).withdraw(payee.address, payeeActiveDepositIds);

          await expect(tx).to.be.revertedWith("Pausable: paused");
        });
      });
    });

    describe("When withdrawing multiple payments", () => {
      let payee1: SignerWithAddress;
      let payee2: SignerWithAddress;

      const oneDayInterval = 3600 * 24;

      beforeEach(async () => {
        payee1 = fixtures.signers.others[2];
        payee2 = fixtures.signers.others[3];

        // Whitelist payees
        await Promise.all([
          pbmContract
            .connect(fixtures.signers.admin)
            .grantRole(fixtures.roles.payeeRole, payee1.address),
          pbmContract
            .connect(fixtures.signers.admin)
            .grantRole(fixtures.roles.payeeRole, payee2.address),
        ]);

        // Make a total of 5 payments
        // Pay to payee1
        await pbmContract.connect(payer).pay(payee1.address, parseAmount(100), lockPeriod);
        // Pay to payee2
        await pbmContract.connect(payer).pay(payee2.address, parseAmount(100), lockPeriod);

        // One day later...
        await time.increase(oneDayInterval);

        // Pay to payee1 again
        await pbmContract.connect(payer).pay(payee1.address, parseAmount(100), lockPeriod);
        // Pay to payee2 again with different a different locking period
        await pbmContract.connect(payer).pay(payee2.address, parseAmount(100), 3600 * 24 * 30);

        // Another day later...
        await time.increase(oneDayInterval);

        // Pay to payee1 again
        await pbmContract.connect(payer).pay(payee1.address, parseAmount(100), lockPeriod);
      });

      describe("Withdrawal Preview", () => {
        let payee1Amount: BigNumber;
        let payee2Amount: BigNumber;
        let depositIds1Included: boolean[];
        let depositIds2Included: boolean[];

        describe("When all deposit IDs are not matured yet", () => {
          beforeEach(async () => {
            [payee1Amount, depositIds1Included] = await pbmVaultContract.previewWithdraw(
              payee1.address,
              [0, 2, 4],
            );
            [payee2Amount, depositIds2Included] = await pbmVaultContract.previewWithdraw(
              payee2.address,
              [1, 3],
            );
          });

          it("should return zero amount", async () => {
            expect(payee1Amount).to.equal(parseAmount(0));
            expect(payee2Amount).to.equal(parseAmount(0));
          });

          it("should return false for all deposit IDs included as they are not matured", async () => {
            expect(depositIds1Included).to.deep.equal([false, false, false]);
            expect(depositIds2Included).to.deep.equal([false, false]);
          });
        });

        describe("When some of the deposit IDs are matured", () => {
          beforeEach(async () => {
            // 13 days later... Payee1's payment will only mature 14 days later.
            await time.increase(oneDayInterval * 13);

            [payee1Amount, depositIds1Included] = await pbmVaultContract.previewWithdraw(
              payee1.address,
              [0, 2, 4],
            );
            [payee2Amount, depositIds2Included] = await pbmVaultContract.previewWithdraw(
              payee2.address,
              [1, 3],
            );
          });

          it("should return the total amount of the specified deposit IDs that qualify for withdrawal", async () => {
            expect(payee1Amount).to.equal(parseAmount(200));
            expect(payee2Amount).to.equal(parseAmount(100));
          });

          it("should return the included deposit IDs indicating only those that are matured", async () => {
            expect(depositIds1Included).to.deep.equal([true, true, false]);
            expect(depositIds2Included).to.deep.equal([true, false]);
          });
        });

        describe("When some of the deposit IDs are inactive deposits", () => {
          beforeEach(async () => {
            await time.increase(oneDayInterval * 13);
            await pbmContract.connect(payee2).withdraw(payee2.address, [1]);

            [payee2Amount, depositIds2Included] = await pbmVaultContract.previewWithdraw(
              payee2.address,
              [1, 3],
            );
          });

          it("should return only the total amount of the deposit IDs that are active", async () => {
            expect(payee2Amount).to.equal(parseAmount(0));
          });

          it("should return false for the specified inactive deposit IDs", async () => {
            expect(depositIds2Included).to.deep.equal([false, false]);
          });
        });

        describe("When all deposit IDs are matured", () => {
          beforeEach(async () => {
            // 30 days later... All payments matured.
            await time.increase(oneDayInterval * 30);

            [payee1Amount, depositIds1Included] = await pbmVaultContract.previewWithdraw(
              payee1.address,
              [0, 2, 4],
            );
            [payee2Amount, depositIds2Included] = await pbmVaultContract.previewWithdraw(
              payee2.address,
              [1, 3],
            );
          });

          it("should return the total amount of the specified deposit IDs", async () => {
            expect(payee1Amount).to.equal(parseAmount(300));
            expect(payee2Amount).to.equal(parseAmount(200));
          });

          it("should return true for all the specified deposit IDs that are matured", async () => {
            expect(depositIds1Included).to.deep.equal([true, true, true]);
            expect(depositIds2Included).to.deep.equal([true, true]);
          });
        });
      });

      it("should revert if batch withdrawal includes a premature deposit", async () => {
        // 13 days later... Payee1's payment will only mature 14 days later.
        await time.increase(oneDayInterval * 13);

        const tx = pbmContract.connect(payee1).withdraw(payee1.address, [0, 2, 4]);

        await expect(tx).to.be.revertedWithCustomError(pbmVaultContract, "DepositNotMatured");
      });

      it("should batch withdraw successfully", async () => {
        // 14 days later... All of Payee1's payment will be matured.
        await time.increase(oneDayInterval * 14);

        await pbmContract.connect(payee1).withdraw(payee1.address, [0, 2, 4]);
        const payee1Balance = await pbmContract.balanceOf(payee1.address);

        expect(payee1Balance).to.equal(parseAmount(300));
      });
    });

    describe("When parameters do not pass validation", () => {
      it("should revert if no deposit IDs were specified", async () => {
        const tx = pbmContract.connect(payee).withdraw(payee.address, []);

        await expect(tx).to.be.revertedWithCustomError(pbmVaultContract, "ParamDepositIdsIsEmpty");
      });
    });

    describe("When emergency withdrawal is activated", () => {
      let recipient: SignerWithAddress;
      let admin: SignerWithAddress;

      beforeEach(async () => {
        recipient = fixtures.signers.others[5];
        admin = fixtures.signers.admin;

        await pbmContract.connect(admin).pause();
      });

      it("should revert if contract is not paused", async () => {
        await pbmContract.connect(admin).unpause();

        const tx = pbmContract.connect(admin).emergencyWithdraw(recipient.address);

        await expect(tx).to.be.revertedWith("Pausable: not paused");
      });

      it("should transfer all underlying assets to recipient", async () => {
        const underlyingAssetBalance = await dsgdContract.balanceOf(pbmContract.address);

        await pbmContract.connect(admin).emergencyWithdraw(recipient.address);

        const recipientBalance = await dsgdContract.balanceOf(recipient.address);
        const contractBalance = await pbmContract.balanceOf(pbmContract.address);

        expect(recipientBalance.toString()).to.equal(underlyingAssetBalance.toString());
        expect(contractBalance.toString()).to.equal("0");
      });
    });
  });
});
