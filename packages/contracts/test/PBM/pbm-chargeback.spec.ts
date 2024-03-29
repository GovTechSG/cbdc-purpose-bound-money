import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { assert, expect } from "chai";
import { BigNumber, ContractTransaction } from "ethers";
import { ethers } from "hardhat";

import { parseAmount } from "../../common/utils";
import {
  DSGD,
  MockPBMTaskManagerFailCancellation,
  MockPBMTaskManagerFailCancellation__factory,
  MockPBMTaskManagerRevert,
  MockPBMTaskManagerRevert__factory,
  PBM,
  PBMVault,
} from "../../types";
import { deployPBMFixture } from "./pbm.fixture";

describe("PBM - Chargeback", () => {
  let fixtures: Awaited<ReturnType<typeof deployPBMFixture>>;

  let pbmContract: PBM;
  let pbmVaultContract: PBMVault;
  let dsgdContract: DSGD;

  beforeEach(async () => {
    fixtures = await loadFixture(deployPBMFixture);
    pbmContract = fixtures.pbmContract;
    pbmVaultContract = fixtures.pbmVaultContract;
    dsgdContract = fixtures.dsgdContract;

    await pbmContract
      .connect(fixtures.signers.admin)
      .setTaskManager(fixtures.mockPbmTaskManagerContract.address);
  });

  describe("Chargeback", () => {
    let admin: SignerWithAddress;
    let treasurer: SignerWithAddress;
    let payer: SignerWithAddress;
    let payee: SignerWithAddress;

    const amount = parseAmount(500);
    const lockPeriod = 3600 * 24 * 14; // 14 days

    beforeEach(async () => {
      admin = fixtures.signers.admin;
      payer = fixtures.signers.payer;
      treasurer = fixtures.signers.treasurer;
      payee = fixtures.signers.payee;
    });

    const testMatrixAutoWithdrawal = [true, false];

    testMatrixAutoWithdrawal.forEach((autoWithdrawal) => {
      describe(`When autoWithdrawal is ${autoWithdrawal}`, () => {
        beforeEach(async () => {
          // Make a payment
          await pbmContract.connect(payer).pay(payee.address, amount, lockPeriod, autoWithdrawal);

          // Assert payee's initial vPBM balance
          const payeeVpbmBalance = await pbmVaultContract.balanceOf(payee.address);
          assert.equal(payeeVpbmBalance.toString(), amount.toString());
        });

        describe("When an treasurer initiates a refund", () => {
          it("should revert if deposit ID does not exist", async () => {
            const invalidDepositId = 5;

            const tx = pbmContract.connect(treasurer).chargeback(payee.address, invalidDepositId);

            await expect(tx).to.be.revertedWithCustomError(
              pbmVaultContract,
              "InvalidDepositIdRange",
            );
          });

          describe("When the payment has already matured", () => {
            beforeEach(async () => {
              await time.increase(lockPeriod + 1);
            });

            describe("When passed with incorrect chargeback parameters", () => {
              it("should revert if refund payment under another payee's address", async () => {
                const anotherPayee = fixtures.signers.others[5];
                await pbmContract
                  .connect(admin)
                  .grantRole(fixtures.roles.payeeRole, anotherPayee.address);
                const tx = pbmContract.connect(treasurer).chargeback(anotherPayee.address, 0);

                await expect(tx).to.be.revertedWithCustomError(
                  pbmVaultContract,
                  "InvalidActiveDeposit",
                );
              });

              it("should revert if refund payment with an invalid deposit ID", async () => {
                const tx = pbmContract.connect(treasurer).chargeback(payee.address, 1);

                await expect(tx).to.be.revertedWithCustomError(
                  pbmVaultContract,
                  "InvalidDepositIdRange",
                );
              });
            });

            describe("When passed with the intended chargeback parameters", () => {
              it("should revert on refund", async () => {
                const tx = pbmContract.connect(treasurer).chargeback(payee.address, 0);

                await expect(tx).to.be.revertedWithCustomError(
                  pbmVaultContract,
                  "DepositAlreadyMatured",
                );
              });
            });
          });

          describe("When the payment has not matured", () => {
            describe("When passed with incorrect chargeback parameters", () => {
              it("should revert if refund payment under another payee's address", async () => {
                const anotherPayee = fixtures.signers.others[5];
                await pbmContract
                  .connect(admin)
                  .grantRole(fixtures.roles.payeeRole, anotherPayee.address);
                const tx = pbmContract.connect(treasurer).chargeback(anotherPayee.address, 0);

                await expect(tx).to.be.revertedWithCustomError(
                  pbmVaultContract,
                  "InvalidActiveDeposit",
                );
              });

              it("should revert if refund payment with an invalid deposit ID", async () => {
                const tx = pbmContract.connect(treasurer).chargeback(payee.address, 1);

                await expect(tx).to.be.revertedWithCustomError(
                  pbmVaultContract,
                  "InvalidDepositIdRange",
                );
              });
            });

            describe("When passed with the intended chargeback parameters", () => {
              let refundTx: ContractTransaction;
              let initialSupply: BigNumber;
              let payerInitialUnderlyingAssetBalance: BigNumber;
              let payeeInitialVPbmBalance: BigNumber;

              beforeEach(async () => {
                initialSupply = await pbmContract.totalSupply();
                payerInitialUnderlyingAssetBalance = await dsgdContract.balanceOf(payer.address);

                // Assert that payee's vPBM balance is equal to the amount of PBM tokens paid to her
                payeeInitialVPbmBalance = await pbmVaultContract.balanceOf(payee.address);
                assert.equal(payeeInitialVPbmBalance.toString(), amount.toString());

                refundTx = await pbmContract.connect(treasurer).chargeback(payee.address, 0);
              });

              it("should burn the vPBM token from payee", async () => {
                const payeeVPbmBalance = await pbmVaultContract.balanceOf(payee.address);

                expect(payeeVPbmBalance).to.equal(0);
              });

              it("should emit Transfer event for burning vPBM token from payee", async () => {
                await expect(refundTx)
                  .to.emit(pbmVaultContract, "Transfer")
                  .withArgs(payee.address, ethers.constants.AddressZero, amount.toString());
              });

              it("should transfer PBM token from vault back to payer before burning", async () => {
                await expect(refundTx)
                  .to.emit(pbmContract, "Transfer")
                  .withArgs(pbmVaultContract.address, payer.address, amount.toString());
              });

              it("should burn the PBM tokens refunded to payer", async () => {
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

              it("should not transfer PBM token from vault to payee", async () => {
                const payeePbmBalance = await pbmContract.balanceOf(payee.address);

                expect(payeePbmBalance).to.equal(0);
              });

              it("should not transfer underlying asset to payee", async () => {
                const payeeDsgdBalance = await dsgdContract.balanceOf(payee.address);

                expect(payeeDsgdBalance).to.equal(0);
              });

              it("should revert if attempt to chargeback again", async () => {
                const tx = pbmContract.connect(treasurer).chargeback(payee.address, 0);

                await expect(tx).to.be.revertedWithCustomError(
                  pbmVaultContract,
                  "InvalidActiveDeposit",
                );
              });

              it("should emit Refund event", async () => {
                await expect(refundTx)
                  .to.emit(pbmContract, "Refund")
                  .withArgs(0, payee.address, treasurer.address, payer.address, amount);
              });
            });
          });

          describe("When the contract is paused", () => {
            beforeEach(async () => {
              // Pause contract
              await pbmContract.connect(fixtures.signers.admin).pause();
            });

            it("should revert with paused reason", async () => {
              const tx = pbmContract.connect(fixtures.signers.payer).chargeback(payee.address, 0);

              await expect(tx).to.be.revertedWith("Pausable: paused");
            });
          });
        });

        describe("When a non-treasurer initiates a refund", () => {
          it("should revert if caller is not a treasurer", async () => {
            const nonTreasurer = fixtures.signers.others[5];

            const tx = pbmContract.connect(nonTreasurer).chargeback(payee.address, 0);

            await expect(tx)
              .to.be.revertedWithCustomError(pbmContract, "UnauthorisedCaller")
              .withArgs(nonTreasurer.address, fixtures.roles.treasurerRole);
          });

          it("should revert if caller is a payer only", async () => {
            const tx = pbmContract.connect(payer).chargeback(payee.address, 0);

            await expect(tx)
              .to.be.revertedWithCustomError(pbmContract, "UnauthorisedCaller")
              .withArgs(payer.address, fixtures.roles.treasurerRole);
          });

          it("should revert if caller is a payee only", async () => {
            const tx = pbmContract.connect(payee).chargeback(payee.address, 0);

            await expect(tx)
              .to.be.revertedWithCustomError(pbmContract, "UnauthorisedCaller")
              .withArgs(payee.address, fixtures.roles.treasurerRole);
          });

          it("should revert if caller is an admin only", async () => {
            const tx = pbmContract.connect(admin).chargeback(payee.address, 0);

            await expect(tx)
              .to.be.revertedWithCustomError(pbmContract, "UnauthorisedCaller")
              .withArgs(admin.address, fixtures.roles.treasurerRole);
          });
        });
      });
    });

    describe("When cancelling withdrawal automation on task manager", () => {
      describe("When task manager does not revert on PBM", () => {
        describe("When task manager cancelWithdrawTask returns true", () => {
          beforeEach(async () => {
            await pbmContract
              .connect(admin)
              .setTaskManager(fixtures.mockPbmTaskManagerContract.address);

            await pbmContract.connect(payer).pay(payee.address, amount, lockPeriod, true);
          });

          it("should chargeback successfully without reverting", async () => {
            const chargebackTx = await pbmContract.connect(treasurer).chargeback(payee.address, 0);

            expect(chargebackTx).to.not.be.reverted;
          });
        });

        describe("When task manager cancelWithdrawTask returns false", () => {
          let chargebackTx: Promise<ContractTransaction>;
          let mockPbmTaskManagerFailCancellationContract: MockPBMTaskManagerFailCancellation;

          beforeEach(async () => {
            const { deployer } = fixtures.signers;

            // Set a non-reverting mock PBMTaskManager to PBM first to order to proceed with payment
            await pbmContract
              .connect(admin)
              .setTaskManager(fixtures.mockPbmTaskManagerContract.address);
            await pbmContract.connect(payer).pay(payee.address, amount, lockPeriod, true);

            const mockPbmTaskManagerFailCancellationFactory = (await ethers.getContractFactory(
              "MockPBMTaskManagerFailCancellation",
            )) as MockPBMTaskManagerFailCancellation__factory;
            mockPbmTaskManagerFailCancellationContract =
              await mockPbmTaskManagerFailCancellationFactory.connect(deployer).deploy();
            await mockPbmTaskManagerFailCancellationContract.deployed();

            // Now, swap the task manager on PBM to one that will revert
            await pbmContract
              .connect(admin)
              .setTaskManager(mockPbmTaskManagerFailCancellationContract.address);

            chargebackTx = pbmContract.connect(treasurer).chargeback(payee.address, 0);
          });

          it("should chargeback successfully without reverting", async () => {
            await expect(chargebackTx).to.not.be.reverted;
          });
        });
      });

      describe("When task manager reverts on PBM", () => {
        let mockPbmTaskManagerRevertContract: MockPBMTaskManagerRevert;

        beforeEach(async () => {
          const { deployer } = fixtures.signers;

          // Set a non-reverting mock PBMTaskManager to PBM first to order to proceed with payment
          await pbmContract
            .connect(fixtures.signers.admin)
            .setTaskManager(fixtures.mockPbmTaskManagerContract.address);
          await pbmContract.connect(payer).pay(payee.address, amount, lockPeriod, true);

          const mockPbmTaskManagerRevertFactory = (await ethers.getContractFactory(
            "MockPBMTaskManagerRevert",
          )) as MockPBMTaskManagerRevert__factory;
          mockPbmTaskManagerRevertContract = await mockPbmTaskManagerRevertFactory
            .connect(deployer)
            .deploy();
          await mockPbmTaskManagerRevertContract.deployed();

          // Assert that mock PBMTaskManager will revert
          const tx = mockPbmTaskManagerRevertContract.createWithdrawalTask(
            ethers.constants.AddressZero,
            0,
          );
          await expect(tx).to.be.reverted;

          // Now, swap the task manager on PBM to one that will revert
          await pbmContract
            .connect(fixtures.signers.admin)
            .setTaskManager(mockPbmTaskManagerRevertContract.address);
        });

        it("should chargeback successfully without reverting", async () => {
          const chargebackTx = pbmContract.connect(treasurer).chargeback(payee.address, 0);

          expect(chargebackTx).to.not.be.reverted;
        });

        it("should emit TaskManagerCancelWithdrawalFailed event", async () => {
          const chargebackTx = pbmContract.connect(treasurer).chargeback(payee.address, 0);

          await expect(chargebackTx).to.emit(pbmContract, "TaskManagerCancelWithdrawalFailed");
        });
      });

      describe("When there is no task manager attached to PBM", () => {
        let chargebackTx: ContractTransaction;

        beforeEach(async () => {
          // Set mock PBMTaskManager as zero on PBM
          await pbmContract
            .connect(fixtures.signers.admin)
            .setTaskManager(ethers.constants.AddressZero);

          await pbmContract.connect(payer).pay(payee.address, amount, lockPeriod, false);
          chargebackTx = await pbmContract.connect(treasurer).chargeback(payee.address, 0);
        });

        it("should chargeback successfully without reverting", async () => {
          expect(chargebackTx).to.not.be.reverted;
        });
      });
    });
  });
});
