import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { assert, expect } from "chai";
import { BigNumber, ContractTransaction, ethers } from "ethers";

import { DSGD, PBM, PBMVault } from "../../types";
import { parseAmount } from "../utils";
import { deployPBMFixture } from "./pbm.fixture";

describe("PBM - Payments", () => {
  let fixtures: Awaited<ReturnType<typeof deployPBMFixture>>;

  let pbmContract: PBM;
  let pbmVaultContract: PBMVault;
  let dsgdContract: DSGD;

  let payer: SignerWithAddress;

  beforeEach(async () => {
    fixtures = await loadFixture(deployPBMFixture);
    pbmContract = fixtures.pbmContract;
    pbmVaultContract = fixtures.pbmVaultContract;
    dsgdContract = fixtures.dsgdContract;

    payer = fixtures.signers.payer;
  });

  describe("Payments", () => {
    const lockingPeriod = 3600 * 24 * 14; // 14 days
    let payingAmount: BigNumber;
    let payeeRole: string;

    beforeEach(async () => {
      payingAmount = parseAmount(5000);
      payeeRole = fixtures.roles.payeeRole;
    });

    describe("When caller is a payer", () => {
      describe("When payee is not whitelisted", () => {
        it("should revert when paid to payee", async () => {
          const nonWhitelistedPayee = fixtures.signers.others[5];

          const tx = pbmContract
            .connect(payer)
            .pay(nonWhitelistedPayee.address, payingAmount, lockingPeriod);

          await expect(tx)
            .to.be.revertedWithCustomError(pbmContract, "AccountHasNoRole")
            .withArgs(nonWhitelistedPayee.address, payeeRole);
        });
      });

      describe("When payee is whitelisted", () => {
        let payee: SignerWithAddress;

        beforeEach(async () => {
          // Whitelisted payee from fixtures
          payee = fixtures.signers.payee;
        });

        describe("When payer does not have underlying asset at all", () => {
          let payerWithNoAsset: SignerWithAddress;

          beforeEach(async () => {
            payerWithNoAsset = fixtures.signers.payer;

            // Burn all of payer's asset
            await dsgdContract
              .connect(fixtures.signers.deployer)
              .burn(
                payerWithNoAsset.address,
                await dsgdContract.balanceOf(payerWithNoAsset.address),
              );

            // Assert that payer has no asset
            const dsgdBalance = await dsgdContract.balanceOf(payerWithNoAsset.address);
            assert.equal(dsgdBalance.toString(), "0");
          });

          it("should revert when payer attempts to pay", async () => {
            const tx = pbmContract
              .connect(payerWithNoAsset)
              .pay(payee.address, payingAmount, lockingPeriod);

            await expect(tx).to.be.revertedWith("ERC20: transfer amount exceeds balance");
          });
        });

        describe("When payer holds underlying asset", () => {
          describe("When payer has sufficient underlying asset", () => {
            it("should revert when payer has not approved", async () => {
              // Revoked
              await dsgdContract.connect(payer).approve(pbmContract.address, 0);
              const allowance = await dsgdContract.allowance(payer.address, pbmContract.address);
              assert.equal(allowance.toString(), "0");

              const tx = pbmContract.connect(payer).pay(payee.address, payingAmount, lockingPeriod);

              await expect(tx).to.be.revertedWith("ERC20: insufficient allowance");
            });

            it("should pay successfully when payer has approved sufficient underlying asset", async () => {
              const tx = pbmContract.connect(payer).pay(payee.address, payingAmount, lockingPeriod);

              await expect(tx).to.be.fulfilled;
            });
          });

          describe("When payer has insufficient underlying asset", () => {
            it("should revert when payer does not hold enough asset", async () => {
              const payerDsgdBalance = await dsgdContract.balanceOf(payer.address);
              const exceedingAmount = payerDsgdBalance.add(1);

              const tx = pbmContract
                .connect(payer)
                .pay(payee.address, exceedingAmount, lockingPeriod);

              await expect(tx).to.be.revertedWith("ERC20: transfer amount exceeds balance");
            });
          });
        });
      });
    });

    describe("When caller is not a payer", () => {
      let payee: SignerWithAddress;

      beforeEach(async () => {
        // Whitelisted payee from fixtures
        payee = fixtures.signers.payee;
      });

      it("should revert if caller is not a payer", async () => {
        const nonPayer = fixtures.signers.others[5];

        const tx = pbmContract.connect(nonPayer).pay(payee.address, payingAmount, lockingPeriod);

        await expect(tx)
          .to.be.revertedWithCustomError(pbmContract, "UnauthorisedCaller")
          .withArgs(nonPayer.address, fixtures.roles.payerRole);
      });

      it("should revert if caller is a treasurer only", async () => {
        const treasurer = fixtures.signers.treasurer;

        const tx = pbmContract
          .connect(fixtures.signers.treasurer)
          .pay(payee.address, payingAmount, lockingPeriod);

        await expect(tx)
          .to.be.revertedWithCustomError(pbmContract, "UnauthorisedCaller")
          .withArgs(treasurer.address, fixtures.roles.payerRole);
      });

      it("should revert if caller is a payee only", async () => {
        const tx = pbmContract.connect(payee).pay(payee.address, payingAmount, lockingPeriod);

        await expect(tx)
          .to.be.revertedWithCustomError(pbmContract, "UnauthorisedCaller")
          .withArgs(payee.address, fixtures.roles.payerRole);
      });

      it("should revert if caller is an admin only", async () => {
        const admin = fixtures.signers.admin;

        const tx = pbmContract.connect(admin).pay(payee.address, payingAmount, lockingPeriod);

        await expect(tx)
          .to.be.revertedWithCustomError(pbmContract, "UnauthorisedCaller")
          .withArgs(admin.address, fixtures.roles.payerRole);
      });
    });

    describe("When making payments", () => {
      let payTx: ContractTransaction;
      let nextBlockTimeStamp: number;
      let payee: SignerWithAddress;

      beforeEach(async () => {
        // Whitelisted payee
        payee = fixtures.signers.payee;

        // Assert initial payee deposits state
        const initialPayeeDeposits = await pbmVaultContract.getAllDepositIds(payee.address);
        assert.equal(initialPayeeDeposits.length, 0);
      });

      describe("When payment is made without locking period", () => {
        beforeEach(async () => {
          // Pay with no locking period
          payTx = await pbmContract.connect(payer).pay(payee.address, payingAmount, 0);
        });

        it("should emit PBM Transfer event", async () => {
          await expect(payTx)
            .to.emit(pbmContract, "Transfer")
            .withArgs(ethers.constants.AddressZero, payee.address, payingAmount);
        });

        it("should emit DSGD Transfer event", async () => {
          await expect(payTx)
            .to.emit(dsgdContract, "Transfer")
            .withArgs(payer.address, pbmContract.address, payingAmount);
        });

        it("should not emit Deposit event from the vault", async () => {
          await expect(payTx).to.not.emit(pbmVaultContract, "Deposit");
        });

        it("should transfer PBM token to payee ", async () => {
          const payeePbmBalance = await pbmContract.balanceOf(payee.address);

          expect(payeePbmBalance).to.be.equal(payingAmount);
        });

        it("should not transfer PBM token to vault", async () => {
          const vaultBalance = await pbmVaultContract.balanceOf(pbmContract.address);

          expect(vaultBalance).to.be.equal(0);
        });

        it("should not commit deposit to vault for payee", async () => {
          const payeeDeposits = await pbmVaultContract.getAllDepositIds(payee.address);

          expect(payeeDeposits.length).to.be.equal(0);
        });

        it("should emit Payment event from PBM contract with correct parameters", async () => {
          await expect(payTx)
            .to.emit(pbmContract, "Payment")
            .withArgs(payer.address, payee.address, payingAmount, 0);
        });
      });

      describe("When payment is made with locking period", () => {
        let redeemTimestamp: number;

        beforeEach(async () => {
          // Setup next block time
          nextBlockTimeStamp = (await time.latest()) + 1;
          await time.setNextBlockTimestamp(nextBlockTimeStamp);

          redeemTimestamp = nextBlockTimeStamp + lockingPeriod;

          // Pay with locking period
          payTx = await pbmContract.connect(payer).pay(payee.address, payingAmount, lockingPeriod);
        });

        describe("Events emitted", () => {
          it("should emit Deposit event from the vault", async () => {
            await expect(payTx)
              .to.emit(pbmVaultContract, "Deposit")
              .withArgs(
                0,
                payer.address,
                payee.address,
                payingAmount,
                lockingPeriod,
                redeemTimestamp,
              );
          });

          it("should emit PBM Transfer event for minting PBM token to PBM contract", async () => {
            // Mints PBM token to PBM contract
            await expect(payTx)
              .to.emit(pbmContract, "Transfer")
              .withArgs(ethers.constants.AddressZero, pbmContract.address, payingAmount);
          });

          it("should emit DSGD Transfer event from payer to PBM contract", async () => {
            await expect(payTx)
              .to.emit(dsgdContract, "Transfer")
              .withArgs(payer.address, pbmContract.address, payingAmount);
          });

          it("should emit Payment event from PBM contract with correct parameters", async () => {
            await expect(payTx)
              .to.emit(pbmContract, "Payment")
              .withArgs(payer.address, payee.address, payingAmount, lockingPeriod);
          });
        });

        describe("Transfer behaviour", () => {
          it("should not transfer any underlying asset to payee", async () => {
            const payeeDsgdBalance = await dsgdContract.balanceOf(payee.address);
            expect(payeeDsgdBalance).to.equal(0);
          });

          it("should transfer the underlying asset from payer to PBM contract", async () => {
            const pbmContractDsgdBalance = await dsgdContract.balanceOf(pbmContract.address);

            expect(pbmContractDsgdBalance).to.equal(payingAmount);
            await expect(payTx)
              .to.emit(dsgdContract, "Transfer")
              .withArgs(payer.address, pbmContract.address, payingAmount);
          });

          it("should not transfer any PBM token to payee", async () => {
            const payeePbmBalance = await pbmContract.balanceOf(payee.address);
            expect(payeePbmBalance).to.equal(0);
          });

          it("should transfer the correct amount of PBM token from PBM contract to vault", async () => {
            const vaultBalance = await pbmContract.balanceOf(pbmVaultContract.address);

            expect(vaultBalance).to.equal(payingAmount);
            await expect(payTx)
              .to.emit(pbmContract, "Transfer")
              .withArgs(pbmContract.address, pbmVaultContract.address, payingAmount);
          });

          it("should mint the correct amount of vPBM to payee", async () => {
            const payeeVPbmBalance = await pbmVaultContract.balanceOf(payee.address);

            expect(payeeVPbmBalance).to.equal(payingAmount);
          });

          it("should emit Transfer event for minting vPBM to payee", async () => {
            await expect(payTx)
              .to.emit(pbmVaultContract, "Transfer")
              .withArgs(ethers.constants.AddressZero, payee.address, payingAmount);
          });
        });

        describe("Deposit record in vault", () => {
          it("should deposit payment into vault under payee address", async () => {
            const payeeDeposits = await pbmVaultContract.getAllDepositIds(payee.address);

            expect(payeeDeposits.length).to.equal(1);
          });

          it("should indicate payment as active deposit under payee address", async () => {
            const payeeActiveDeposits = await pbmVaultContract.getActiveDepositIds(payee.address);
            const depositId = payeeActiveDeposits[0];
            const isActive = await pbmVaultContract.isDepositActive(payee.address, depositId);

            expect(depositId).to.equal(0);
            expect(isActive).to.be.true;
          });

          it("should deposit the correct amount into the vault", async () => {
            const payeeDeposits = await pbmVaultContract.getAllDepositIds(payee.address);
            const depositId = payeeDeposits[0];

            const deposit = await pbmVaultContract.getDeposit(depositId);

            expect(deposit.amount).to.equal(payingAmount);
          });

          it("should deposit into the vault with the correct locking period", async () => {
            const payeeDeposits = await pbmVaultContract.getAllDepositIds(payee.address);
            const depositId = payeeDeposits[0];

            const deposit = await pbmVaultContract.getDeposit(depositId);

            expect(deposit.redeemTimestamp).to.equal(redeemTimestamp);
          });

          it("should deposit into the vault with the correct payer address", async () => {
            const payeeDeposits = await pbmVaultContract.getAllDepositIds(payee.address);
            const depositId = payeeDeposits[0];

            const deposit = await pbmVaultContract.getDeposit(depositId);

            expect(deposit.depositor).to.equal(payer.address);
          });
        });
      });

      describe("When multiple payments are made to multiple payees", () => {
        let payee1: SignerWithAddress;
        let payee2: SignerWithAddress;
        let paymentTimestamp: number;

        beforeEach(async () => {
          payee1 = fixtures.signers.others[2];
          payee2 = fixtures.signers.others[3];

          // Whitelist payees
          await Promise.all([
            pbmContract.connect(fixtures.signers.admin).grantRole(payeeRole, payee1.address),
            pbmContract.connect(fixtures.signers.admin).grantRole(payeeRole, payee2.address),
          ]);

          // Assert all initial payee deposits states
          const initialPayee1Deposits = await pbmVaultContract.getAllDepositIds(payee1.address);
          const initialPayee2Deposits = await pbmVaultContract.getAllDepositIds(payee2.address);
          assert.equal(initialPayee1Deposits.length, 0);
          assert.equal(initialPayee2Deposits.length, 0);

          // Payment timestamp
          paymentTimestamp = (await time.latest()) + 1;

          // Make a total of 5 payments
          // Pay to payee1
          await pbmContract.connect(payer).pay(payee1.address, parseAmount(100), lockingPeriod);
          // Pay to payee2
          await pbmContract.connect(payer).pay(payee2.address, parseAmount(200), lockingPeriod);
          // Pay to payee1 again
          await pbmContract.connect(payer).pay(payee1.address, parseAmount(300), lockingPeriod);
          // Pay to payee2 again with different a different locking period
          await pbmContract.connect(payer).pay(payee2.address, parseAmount(400), 3600 * 24 * 30);
          // Pay to payee1 again
          await pbmContract.connect(payer).pay(payee1.address, parseAmount(500), lockingPeriod);
        });

        it("should return the correct number of payee's active deposits", async () => {
          const payee1TotalActiveDeposits = await pbmVaultContract.totalActiveDepositsOf(
            payee1.address,
          );
          const payee2TotalActiveDeposits = await pbmVaultContract.totalActiveDepositsOf(
            payee2.address,
          );

          expect(payee1TotalActiveDeposits).to.equal(3);
          expect(payee2TotalActiveDeposits).to.equal(2);
        });

        it("should return the correct number of payee's total deposits", async () => {
          const totalPayee1Deposits = await pbmVaultContract.totalDepositsOf(payee1.address);
          const totalPayee2Deposits = await pbmVaultContract.totalDepositsOf(payee2.address);

          expect(totalPayee1Deposits).to.equal(3);
          expect(totalPayee2Deposits).to.equal(2);
        });

        it("should return the correct number of all deposits made", async () => {
          const totalDeposits = await pbmVaultContract.totalDeposits();

          expect(totalDeposits).to.equal(5);
        });

        it("should return the correct active deposit IDs of payees", async () => {
          const payee1ActiveDeposits = await pbmVaultContract.getActiveDepositIds(payee1.address);
          const payee2ActiveDeposits = await pbmVaultContract.getActiveDepositIds(payee2.address);

          expect(payee1ActiveDeposits).to.deep.equal([0, 2, 4]);
          expect(payee2ActiveDeposits).to.deep.equal([1, 3]);
        });

        it("should return all the payee's deposit IDs", async () => {
          const payee1Deposits = await pbmVaultContract.getAllDepositIds(payee1.address);
          const payee2Deposits = await pbmVaultContract.getAllDepositIds(payee2.address);

          expect(payee1Deposits).to.deep.equal([0, 2, 4]);
          expect(payee2Deposits).to.deep.equal([1, 3]);
        });

        describe("Deposit Pagination", () => {
          it("should return the deposit IDs of all payees correctly", async () => {
            const payee1Deposits = await pbmVaultContract.getDepositIds(payee1.address, 0, 3);
            const payee2Deposits = await pbmVaultContract.getDepositIds(payee2.address, 0, 2);

            expect(payee1Deposits).to.deep.equal([0, 2, 4]);
            expect(payee2Deposits).to.deep.equal([1, 3]);
          });

          it("should take the minimum of deposits total and specified length", async () => {
            const payee1Deposits = await pbmVaultContract.getDepositIds(payee1.address, 0, 5);

            expect(payee1Deposits).to.deep.equal([0, 2, 4]);
          });

          it("should offset the startId and length correctly", async () => {
            const payee1Deposits = await pbmVaultContract.getDepositIds(payee1.address, 1, 1);

            expect(payee1Deposits).to.deep.equal([2]);
          });

          it("should offset the startId and take the minimum of deposits total and specified length correctly", async () => {
            const payee1Deposits = await pbmVaultContract.getDepositIds(payee1.address, 1, 5);

            expect(payee1Deposits).to.deep.equal([2, 4]);
          });

          it("should revert if startId larger than total deposits", async () => {
            const payee1Deposits = pbmVaultContract.getDepositIds(payee1.address, 5, 5);

            await expect(payee1Deposits).to.be.revertedWithCustomError(
              pbmVaultContract,
              "InvalidDepositIdRange",
            );
          });

          it("should revert if length is zero", async () => {
            const payee1Deposits = pbmVaultContract.getDepositIds(payee1.address, 1, 0);

            await expect(payee1Deposits).to.be.revertedWithCustomError(
              pbmVaultContract,
              "InvalidDepositIdRange",
            );
          });
        });

        describe("Retrieving deposits", () => {
          it("should return the specified deposit", async () => {
            const deposit = await pbmVaultContract.getDeposit(0);

            expect(deposit.depositor).to.equal(payer.address);
            expect(deposit.amount).to.equal(parseAmount(100));
            expect(deposit.redeemTimestamp).to.equal(paymentTimestamp + lockingPeriod);
          });

          it("should return all the specified deposits", async () => {
            const payee2Deposits = await pbmVaultContract.getAllDepositIds(payee2.address);
            const deposits = await pbmVaultContract.getDeposits(payee2Deposits);

            expect(deposits.length).to.equal(2);
            expect(deposits[0].amount).to.equal(parseAmount(200));
            expect(deposits[1].amount).to.equal(parseAmount(400));
          });
        });
      });

      describe("When the contract is paused", () => {
        beforeEach(async () => {
          // Pause contract
          await pbmContract.connect(fixtures.signers.deployer).pause();
        });

        it("should revert with paused reason", async () => {
          const tx = pbmContract.connect(payer).pay(payee.address, payingAmount, lockingPeriod);

          await expect(tx).to.be.revertedWith("Pausable: paused");
        });
      });
    });

    describe("When payment parameters do not pass validation check", () => {
      it("should revert if amount is zero", async () => {
        const payee = fixtures.signers.payee;

        const tx = pbmContract.connect(payer).pay(payee.address, 0, lockingPeriod);

        await expect(tx).to.be.revertedWithCustomError(pbmVaultContract, "ParamAmountIsZero");
      });

      it("should revert if payee address is zero", async () => {
        await pbmContract
          .connect(fixtures.signers.admin)
          .grantRole(payeeRole, ethers.constants.AddressZero);

        const tx = pbmContract
          .connect(payer)
          .pay(ethers.constants.AddressZero, payingAmount, lockingPeriod);

        await expect(tx).to.be.revertedWithCustomError(pbmVaultContract, "ParamRecipientIsZero");
      });
    });
  });
});
