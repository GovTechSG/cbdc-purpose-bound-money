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

describe("PBM - Refund", () => {
  let fixtures: Awaited<ReturnType<typeof deployPBMFixture>>;

  let pbmContract: PBM;
  let pbmVaultContract: PBMVault;
  let dsgdContract: DSGD;

  let payer: SignerWithAddress;
  let payee: SignerWithAddress;
  let admin: SignerWithAddress;

  beforeEach(async () => {
    fixtures = await loadFixture(deployPBMFixture);
    pbmContract = fixtures.pbmContract;
    pbmVaultContract = fixtures.pbmVaultContract;
    dsgdContract = fixtures.dsgdContract;

    payer = fixtures.signers.payer;
    payee = fixtures.signers.payee;
    admin = fixtures.signers.admin;
  });

  describe("Refund", () => {
    const amount = parseAmount(500);
    const lockPeriod = 3600 * 24 * 14; // 14 days

    /*
      Test matrix layout:
      | With PBMTaskManager | autoWithdrawal values |
      | ------------------- | --------------------- |
      | true                | [true, false]         |
      | false               | [false]               |
     */
    const testMatrixWithTaskManagerAndAutoWithdrawal = {
      true: [true, false],
      false: [false],
    };

    Object.keys(testMatrixWithTaskManagerAndAutoWithdrawal).forEach((withTaskManager) => {
      const withOrWithout =
        withTaskManager === "true" ? "with" : withTaskManager === "false" ? "without" : "invalid";

      describe(`When PBM is setup ${withOrWithout} task manager`, () => {
        beforeEach(async () => {
          if (withTaskManager === "true") {
            await pbmContract
              .connect(fixtures.signers.admin)
              .setTaskManager(fixtures.mockPbmTaskManagerContract.address);
          }
        });

        const testMatrixAutoWithdrawal =
          testMatrixWithTaskManagerAndAutoWithdrawal[
            withTaskManager as keyof typeof testMatrixWithTaskManagerAndAutoWithdrawal
          ];
        testMatrixAutoWithdrawal.forEach((autoWithdrawal) => {
          describe(`When autoWithdrawal is ${autoWithdrawal}`, () => {
            beforeEach(async () => {
              // Make a payment
              await pbmContract
                .connect(payer)
                .pay(payee.address, amount, lockPeriod, autoWithdrawal);
            });

            describe("When payee initiates a refund", () => {
              it("should revert if deposit ID does not exist", async () => {
                const invalidDepositId = 5;

                const tx = pbmContract.connect(payee).refund(invalidDepositId);

                await expect(tx).to.be.revertedWithCustomError(
                  pbmVaultContract,
                  "InvalidDepositIdRange",
                );
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

                  await expect(tx).to.be.revertedWithCustomError(
                    pbmVaultContract,
                    "DepositAlreadyMatured",
                  );
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
                  const payerNewUnderlyingAssetBalance = await dsgdContract.balanceOf(
                    payer.address,
                  );
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

                  await expect(tx).to.be.revertedWithCustomError(
                    pbmVaultContract,
                    "InvalidActiveDeposit",
                  );
                });

                it("should revert if attempt to refund again", async () => {
                  const doubleRefundTx = pbmContract.connect(payee).refund(0);

                  await expect(doubleRefundTx).to.be.revertedWithCustomError(
                    pbmVaultContract,
                    "InvalidActiveDeposit",
                  );
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
      });
    });

    describe("When cancelling withdrawal automation on task manager", () => {
      describe("When task manager does not revert on PBM", () => {
        describe("When task manager cancelWithdrawTask returns true", () => {
          let refundTx: ContractTransaction;

          beforeEach(async () => {
            await pbmContract
              .connect(admin)
              .setTaskManager(fixtures.mockPbmTaskManagerContract.address);

            await pbmContract.connect(payer).pay(payee.address, amount, lockPeriod, true);
            refundTx = await pbmContract.connect(payee).refund(0);
          });

          it("should refund successfully without reverting", async () => {
            expect(refundTx).to.not.be.reverted;
          });
        });

        describe("When task manager cancelWithdrawTask returns false", () => {
          let refundTx: Promise<ContractTransaction>;
          let mockPbmTaskManagerFailCancellationContract: MockPBMTaskManagerFailCancellation;

          beforeEach(async () => {
            const { deployer } = fixtures.signers;

            const mockPbmTaskManagerFailCancellationFactory = (await ethers.getContractFactory(
              "MockPBMTaskManagerFailCancellation",
            )) as MockPBMTaskManagerFailCancellation__factory;
            mockPbmTaskManagerFailCancellationContract =
              await mockPbmTaskManagerFailCancellationFactory.connect(deployer).deploy();
            await mockPbmTaskManagerFailCancellationContract.deployed();

            await pbmContract
              .connect(admin)
              .setTaskManager(mockPbmTaskManagerFailCancellationContract.address);

            await pbmContract.connect(payer).pay(payee.address, amount, lockPeriod, true);
            refundTx = pbmContract.connect(payee).refund(0);
          });

          it("should refund successfully without reverting", async () => {
            await expect(refundTx).to.not.be.reverted;
          });
        });
      });

      describe("When task manager reverts on PBM", () => {
        let mockPbmTaskManagerRevertContract: MockPBMTaskManagerRevert;
        let refundTx: ContractTransaction;

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

          refundTx = await pbmContract.connect(payee).refund(0);
        });

        it("should refund successfully without reverting", async () => {
          expect(refundTx).to.not.be.reverted;
        });
      });

      describe("When there is no task manager attached to PBM", () => {
        let refundTx: ContractTransaction;

        beforeEach(async () => {
          // Set mock PBMTaskManager as zero on PBM
          await pbmContract
            .connect(fixtures.signers.admin)
            .setTaskManager(ethers.constants.AddressZero);

          await pbmContract.connect(payer).pay(payee.address, amount, lockPeriod, false);
          refundTx = await pbmContract.connect(payee).refund(0);
        });

        it("should refund successfully without reverting", async () => {
          expect(refundTx).to.not.be.reverted;
        });
      });
    });
  });
});
