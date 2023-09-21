import {
  impersonateAccount,
  loadFixture,
  setBalance,
  time,
} from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { assert, expect } from "chai";
import { BigNumber, BigNumberish, BytesLike, ContractTransaction } from "ethers";
import { ethers } from "hardhat";

import { parseAmount } from "../../common/utils";
import { IAutomate, PBM, PBMTaskManager, PBMTaskManager__factory, PBMVault } from "../../types";
import { PromiseOrValue } from "../../types/common";
import { DepositInfoStructOutput } from "../../types/contracts/base/PBMVault";
import { deployPBMFixture } from "../PBM/pbm.fixture";

// Polygon Addresses
const GELATO_AUTOMATE_ADDRESS = "0x527a819db1eb0e34426297b03bae11F2f8B3A19E";
const GELATO_SIGNER_ADDRESS = "0x7598e84b2e114ab62cab288ce5f7d5f6bad35bba";
const GELATO_ETH = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
const GELATO_FEE = ethers.utils.parseEther("1");

describe("PBMTaskManager", () => {
  let fixtures: Awaited<ReturnType<typeof deployPBMFixture>>;

  let pbmContract: PBM;
  let pbmVaultContract: PBMVault;

  let pbmTaskManagerContract: PBMTaskManager;

  let automateContract: IAutomate;
  let gelatoExecutor: SignerWithAddress;

  let admin: SignerWithAddress;
  let treasurer: SignerWithAddress;
  let payer: SignerWithAddress;
  let payee: SignerWithAddress;

  const lockingPeriod = 3600 * 24 * 14; // 14 days
  const payingAmount = parseAmount(5000);

  beforeEach(async () => {
    fixtures = await loadFixture(deployPBMFixture);

    await impersonateAccount(GELATO_SIGNER_ADDRESS);
    gelatoExecutor = await ethers.getSigner(GELATO_SIGNER_ADDRESS);
    admin = fixtures.signers.admin;
    payer = fixtures.signers.payer;
    payee = fixtures.signers.payee;
    treasurer = fixtures.signers.treasurer;

    pbmContract = fixtures.pbmContract;
    pbmVaultContract = fixtures.pbmVaultContract;

    automateContract = (await ethers.getContractAt(
      "contracts/lib/gelato-automate/interfaces/IAutomate.sol:IAutomate",
      GELATO_AUTOMATE_ADDRESS,
    )) as IAutomate;
    pbmTaskManagerContract = await (
      (await ethers.getContractFactory("PBMTaskManager")) as PBMTaskManager__factory
    ).deploy(pbmContract.address, GELATO_AUTOMATE_ADDRESS, treasurer.address);
    await pbmTaskManagerContract.deployed();
  });

  describe("Create Task", () => {
    it("should not allow a non-PBM caller", async () => {
      const tx = pbmTaskManagerContract.connect(admin).createWithdrawalTask(payee.address, 0);

      await expect(tx).to.be.revertedWithCustomError(pbmTaskManagerContract, "TaskCallerNotPBM");
    });

    it("should allow PBM contract to call create task", async () => {
      await impersonateAccount(pbmContract.address);
      const pbmContractSigner = await ethers.getSigner(pbmContract.address);

      const tx = pbmTaskManagerContract
        .connect(pbmContractSigner)
        .createWithdrawalTask(payee.address, 0);

      // Expect to throw InvalidDepositIdRange from PBMVault due to invalid parameters if PBM caller did make the call through on PBMTasksManager
      await expect(tx).to.be.revertedWithCustomError(pbmVaultContract, "InvalidDepositIdRange");
    });
  });

  describe("PBM Payment", () => {
    const testMatrixAutoWithdrawal = [true, false];

    describe("When no task manager is provided to PBM", () => {
      beforeEach(async () => {
        await pbmContract.connect(admin).setTaskManager(ethers.constants.AddressZero);
      });

      it("should revert when PBM pay is called with autoWithdrawal as true", async () => {
        const tx = pbmContract.connect(payer).pay(payee.address, payingAmount, lockingPeriod, true);

        await expect(tx).to.be.revertedWithCustomError(pbmContract, "AutoWithdrawalUnsupported");
      });

      it("should not create task when PBM pay is called with autoWithdrawal as false", async () => {
        await pbmContract.connect(payer).pay(payee.address, payingAmount, lockingPeriod, false);

        const taskIdsByTaskManager = await automateContract.getTaskIdsByUser(
          pbmTaskManagerContract.address,
        );

        expect(taskIdsByTaskManager.length).to.equal(0);
      });
    });

    describe(" When task manager is provided to PBM", () => {
      beforeEach(async () => {
        await pbmContract.connect(admin).setTaskManager(pbmTaskManagerContract.address);
      });

      it("should not create task if autoWithdrawal is false", async () => {
        await pbmContract.connect(payer).pay(payee.address, payingAmount, lockingPeriod, false);

        const taskIdsByTaskManager = await automateContract.getTaskIdsByUser(
          pbmTaskManagerContract.address,
        );

        expect(taskIdsByTaskManager.length).to.equal(0);
      });

      testMatrixAutoWithdrawal.forEach((autoWithdrawal) => {
        describe(`When autoWithdrawal is ${autoWithdrawal}`, () => {
          it("should not create task if payment is immediate", async () => {
            await pbmContract.connect(payer).pay(payee.address, payingAmount, 0, autoWithdrawal);

            const taskIdsByTaskManager = await automateContract.getTaskIdsByUser(
              pbmTaskManagerContract.address,
            );

            expect(taskIdsByTaskManager.length).to.equal(0);
          });
        });
      });
    });
  });

  describe("Automation Funds", () => {
    it("should deposit with correct ETH balance", async () => {
      const donor = fixtures.signers.others[0];
      const initialBalance = await ethers.provider.getBalance(pbmTaskManagerContract.address);
      expect(initialBalance).to.equal(0);

      const tx = {
        to: pbmTaskManagerContract.address,
        value: parseAmount(123),
      };
      await donor.sendTransaction(tx);
      const finalBalance = await ethers.provider.getBalance(pbmTaskManagerContract.address);

      expect(finalBalance).to.equal(parseAmount(123));
    });

    it("should revert if withdraw caller is not funds owner", async () => {
      const tx = pbmTaskManagerContract.connect(payee).withdrawETH(payee.address);

      await expect(tx).to.be.revertedWithCustomError(pbmTaskManagerContract, "CallerNotFundsOwner");
    });

    it("should withdraw all ETH balance to funds owner", async () => {
      const beneficiary = fixtures.signers.others[0];
      await setBalance(beneficiary.address, 0);
      const initialBeneficiaryBalance = await ethers.provider.getBalance(beneficiary.address);
      expect(initialBeneficiaryBalance).to.equal(0);

      await setBalance(pbmTaskManagerContract.address, parseAmount(321));
      const initialBalance = await ethers.provider.getBalance(pbmTaskManagerContract.address);
      expect(initialBalance).to.equal(parseAmount(321));

      await pbmTaskManagerContract.connect(treasurer).withdrawETH(beneficiary.address);
      const finalBalance = await ethers.provider.getBalance(pbmTaskManagerContract.address);
      const finalBeneficiaryBalance = await ethers.provider.getBalance(beneficiary.address);

      expect(finalBalance).to.equal(0);
      expect(finalBeneficiaryBalance).to.equal(parseAmount(321));
    });
  });

  describe("Withdrawal Task", () => {
    const defaultInterval = 60 * 3; // 3 minutes

    beforeEach(async () => {
      await pbmContract.connect(admin).setTaskManager(pbmTaskManagerContract.address);
    });

    describe("When creating task", () => {
      let pbmPayTx: ContractTransaction;
      let taskId: string;

      beforeEach(async () => {
        const initialTaskIdsByTaskManager = await automateContract.getTaskIdsByUser(
          pbmTaskManagerContract.address,
        );
        assert.equal(initialTaskIdsByTaskManager.length, 0);

        pbmPayTx = await pbmContract
          .connect(payer)
          .pay(payee.address, payingAmount, lockingPeriod, true);

        const depositInfo = await pbmVaultContract.getDeposit(0);
        taskId = computeTaskId(
          pbmTaskManagerContract.address,
          pbmTaskManagerContract.address,
          pbmTaskManagerContract.interface.getSighash("execWithdrawal"),
          getWithdrawalModuleData(
            depositInfo.redeemTimestamp,
            computeTaskInterval(defaultInterval, 0),
          ),
          GELATO_ETH,
        );
      });

      it("should create withdrawal task upon payment", async () => {
        const finalTaskIdsByTaskManager = await automateContract.getTaskIdsByUser(
          pbmTaskManagerContract.address,
        );

        expect(finalTaskIdsByTaskManager.length).to.equal(1);
      });

      it("should register task ID as created", async () => {
        const isTaskIdCreated = await pbmTaskManagerContract.taskIds(taskId);

        expect(isTaskIdCreated).to.equal(true);
      });

      it("should emit WithdrawalTaskCreated event", async () => {
        await expect(pbmPayTx)
          .to.emit(pbmTaskManagerContract, "WithdrawalTaskCreated")
          .withArgs(taskId, payee.address, 0);
      });
    });

    describe("When executing tasks", () => {
      let executeWithdrawalTask: (
        executionData: PromiseOrValue<BytesLike>,
        moduleData: IAutomate.ModuleDataStruct,
      ) => Promise<ContractTransaction>;

      beforeEach(async () => {
        executeWithdrawalTask = (
          executionData: PromiseOrValue<BytesLike>,
          moduleData: IAutomate.ModuleDataStruct,
        ) =>
          automateContract
            .connect(gelatoExecutor)
            .exec(
              pbmTaskManagerContract.address,
              pbmTaskManagerContract.address,
              executionData,
              moduleData,
              GELATO_FEE,
              GELATO_ETH,
              false,
              true,
            );
      });

      describe("When there are multiple tasks", () => {
        let depositInfos: DepositInfoStructOutput[];
        let taskIntervals: number[];
        let taskIds: string[];
        let startTime: number;
        const oneDaySeconds = 3600 * 24;

        beforeEach(async () => {
          await Promise.all([
            pbmContract.connect(payer).pay(payee.address, payingAmount, oneDaySeconds * 5, true),
            pbmContract.connect(payer).pay(payee.address, payingAmount, oneDaySeconds * 2, true),
            pbmContract.connect(payer).pay(payee.address, payingAmount, oneDaySeconds * 5, true),
          ]);
          startTime = await time.latest();

          depositInfos = await Promise.all([
            pbmVaultContract.getDeposit(0),
            pbmVaultContract.getDeposit(1),
            pbmVaultContract.getDeposit(2),
          ]);
          taskIntervals = depositInfos.map((depositInfo, idx) =>
            computeTaskInterval(defaultInterval, idx),
          );
          taskIds = depositInfos.map((depositInfo, idx) =>
            computeTaskId(
              pbmTaskManagerContract.address,
              pbmTaskManagerContract.address,
              pbmTaskManagerContract.interface.getSighash("execWithdrawal"),
              getWithdrawalModuleData(
                depositInfo.redeemTimestamp,
                computeTaskInterval(defaultInterval, idx),
              ),
              GELATO_ETH,
            ),
          );

          await setBalance(pbmTaskManagerContract.address, parseAmount(100));
        });

        it("should revert all executions with too early after 1 day", async () => {
          // 1 day later
          await time.increaseTo(startTime + oneDaySeconds);

          const executions = depositInfos.map(
            (depositInfo, idx) => () =>
              executeWithdrawalTask(
                getWithdrawalExecutionData(payee.address, idx),
                getWithdrawalModuleData(depositInfos[idx].redeemTimestamp, taskIntervals[idx]),
              ),
          );

          for (const execution of executions) {
            await expect(execution()).to.be.revertedWith(
              "Automate.preExecCall: TimeModule: Too early",
            );
          }
        });

        it("should have 1 successful and 2 failed executions after 2 days", async () => {
          // 2 days later
          await time.increaseTo(startTime + oneDaySeconds * 2);

          const executions = depositInfos.map(
            (depositInfo, idx) => () =>
              executeWithdrawalTask(
                getWithdrawalExecutionData(payee.address, idx),
                getWithdrawalModuleData(depositInfos[idx].redeemTimestamp, taskIntervals[idx]),
              ),
          );

          await expect(executions[0]()).to.be.revertedWith(
            "Automate.preExecCall: TimeModule: Too early",
          );
          await expect(executions[1]())
            .to.emit(pbmTaskManagerContract, "WithdrawalTaskExecution")
            .withArgs(taskIds[1], true);
          await expect(executions[2]()).to.be.revertedWith(
            "Automate.preExecCall: TimeModule: Too early",
          );
        });

        it("should have all successful executions after 5 days", async () => {
          // 5 days later
          await time.increaseTo(startTime + oneDaySeconds * 5);

          const executions = depositInfos.map(
            (depositInfo, idx) => () =>
              executeWithdrawalTask(
                getWithdrawalExecutionData(payee.address, idx),
                getWithdrawalModuleData(depositInfos[idx].redeemTimestamp, taskIntervals[idx]),
              ),
          );

          for (let i = 0; i < 3; i++) {
            await expect(executions[i]())
              .to.emit(pbmTaskManagerContract, "WithdrawalTaskExecution")
              .withArgs(taskIds[i], true);
          }
        });
      });

      describe("When there is a single task", () => {
        let depositInfo: DepositInfoStructOutput;
        let taskInterval: number;

        beforeEach(async () => {
          await pbmContract.connect(payer).pay(payee.address, payingAmount, lockingPeriod, true);
          depositInfo = await pbmVaultContract.getDeposit(0);
          taskInterval = computeTaskInterval(defaultInterval, 0);
        });

        describe("When start time is not up yet", () => {
          it("should revert with too early error", async () => {
            const tx = executeWithdrawalTask(
              getWithdrawalExecutionData(payee.address, 0),
              getWithdrawalModuleData(depositInfo.redeemTimestamp, taskInterval),
            );

            await expect(tx).to.be.revertedWith("Automate.preExecCall: TimeModule: Too early");
          });
        });

        describe("When start time is up", () => {
          beforeEach(async () => {
            await time.increaseTo(depositInfo.redeemTimestamp);
          });

          describe("When task manager has insufficient funds", () => {
            it("should revert when task manager has empty balance", async () => {
              const pbmTaskManagerBalance = await ethers.provider.getBalance(
                pbmTaskManagerContract.address,
              );
              expect(pbmTaskManagerBalance).to.equal(0);

              const tx = executeWithdrawalTask(
                getWithdrawalExecutionData(payee.address, 0),
                getWithdrawalModuleData(depositInfo.redeemTimestamp, taskInterval),
              );

              await expect(tx).to.be.revertedWith(
                "Automate.exec: OpsProxy.executeCall: _transfer: ETH transfer failed",
              );
            });

            it("should revert when task manager has insufficient balance", async () => {
              await setBalance(pbmTaskManagerContract.address, parseAmount(0.1));
              const pbmTaskManagerBalance = await ethers.provider.getBalance(
                pbmTaskManagerContract.address,
              );
              expect(pbmTaskManagerBalance).to.equal(parseAmount(0.1));

              const tx = executeWithdrawalTask(
                getWithdrawalExecutionData(payee.address, 0),
                getWithdrawalModuleData(depositInfo.redeemTimestamp, taskInterval),
              );

              await expect(tx).to.be.revertedWith(
                "Automate.exec: OpsProxy.executeCall: _transfer: ETH transfer failed",
              );
            });
          });

          describe("When task manager has sufficient funds", () => {
            it("should execute task successfully with sufficient balance", async () => {
              const initialPayeePbmBalance = await pbmContract.balanceOf(payee.address);
              expect(initialPayeePbmBalance).to.equal(0);

              await setBalance(pbmTaskManagerContract.address, parseAmount(1));
              const pbmTaskManagerBalance = await ethers.provider.getBalance(
                pbmTaskManagerContract.address,
              );
              expect(pbmTaskManagerBalance).to.equal(parseAmount(1));

              await executeWithdrawalTask(
                getWithdrawalExecutionData(payee.address, 0),
                getWithdrawalModuleData(depositInfo.redeemTimestamp, taskInterval),
              );

              const finalPayeePbmBalance = await pbmContract.balanceOf(payee.address);
              expect(finalPayeePbmBalance).to.equal(payingAmount);
            });
          });

          describe("When task is executed successfully", () => {
            let taskId: string;
            let executeWithdrawalTaskTx: ContractTransaction;

            beforeEach(async () => {
              taskId = computeTaskId(
                pbmTaskManagerContract.address,
                pbmTaskManagerContract.address,
                pbmTaskManagerContract.interface.getSighash("execWithdrawal"),
                getWithdrawalModuleData(
                  depositInfo.redeemTimestamp,
                  computeTaskInterval(defaultInterval, 0),
                ),
                GELATO_ETH,
              );

              await setBalance(pbmTaskManagerContract.address, parseAmount(1));
              executeWithdrawalTaskTx = await executeWithdrawalTask(
                getWithdrawalExecutionData(payee.address, 0),
                getWithdrawalModuleData(depositInfo.redeemTimestamp, taskInterval),
              );
            });

            it("should emit WithdrawalTaskExecution event with success as true", async () => {
              await expect(executeWithdrawalTaskTx)
                .to.emit(pbmTaskManagerContract, "WithdrawalTaskExecution")
                .withArgs(taskId, true);
            });

            it("should cancel the task", async () => {
              const tasksByTaskManager = await automateContract.getTaskIdsByUser(
                pbmTaskManagerContract.address,
              );

              expect(tasksByTaskManager.length).to.equal(0);
            });

            it("should reset the task retry count", async () => {
              const taskRetryCount = await pbmTaskManagerContract.taskRetries(taskId);

              expect(taskRetryCount).to.equal(0);
            });

            it("should reset the task ID created record", async () => {
              const isTaskIdCreated = await pbmTaskManagerContract.taskIds(taskId);

              expect(isTaskIdCreated).to.equal(false);
            });
          });

          describe("When the PBM withdraw function reverts", () => {
            let taskId: string;

            beforeEach(async () => {
              taskId = computeTaskId(
                pbmTaskManagerContract.address,
                pbmTaskManagerContract.address,
                pbmTaskManagerContract.interface.getSighash("execWithdrawal"),
                getWithdrawalModuleData(
                  depositInfo.redeemTimestamp,
                  computeTaskInterval(defaultInterval, 0),
                ),
                GELATO_ETH,
              );

              // Payee withdraws before the task is executed to simulate a revert in the PBM withdraw function
              // Note: This scenario is unlikely to happen in production because the relayer will simulate the task before execution.
              await pbmContract.connect(payee).withdraw(payee.address, [0]);

              // Assert that the retry count is 0
              const taskRetryCount = await pbmTaskManagerContract.taskRetries(taskId);
              expect(taskRetryCount).to.equal(0);

              await setBalance(pbmTaskManagerContract.address, parseAmount(10));
            });

            it("should increase the retry count by 1", async () => {
              await executeWithdrawalTask(
                getWithdrawalExecutionData(payee.address, 0),
                getWithdrawalModuleData(depositInfo.redeemTimestamp, taskInterval),
              );

              const taskRetryCount = await pbmTaskManagerContract.taskRetries(taskId);

              expect(taskRetryCount).to.equal(1);
            });

            it("should emit WithdrawalTaskExecution event with success as false", async () => {
              const tx = executeWithdrawalTask(
                getWithdrawalExecutionData(payee.address, 0),
                getWithdrawalModuleData(depositInfo.redeemTimestamp, taskInterval),
              );

              await expect(tx)
                .to.emit(pbmTaskManagerContract, "WithdrawalTaskExecution")
                .withArgs(taskId, false);
            });

            it("should allow the executor to call the task again", async () => {
              await executeWithdrawalTask(
                getWithdrawalExecutionData(payee.address, 0),
                getWithdrawalModuleData(depositInfo.redeemTimestamp, taskInterval),
              );
              await time.increaseTo((await time.latest()) + taskInterval);

              const tx = executeWithdrawalTask(
                getWithdrawalExecutionData(payee.address, 0),
                getWithdrawalModuleData(depositInfo.redeemTimestamp, taskInterval),
              );
              await expect(tx).to.not.be.reverted;

              const taskRetryCount = await pbmTaskManagerContract.taskRetries(taskId);
              expect(taskRetryCount).to.equal(2);
            });

            describe("When the task is executed until its max retry count", () => {
              const MAX_RETRY_COUNT = 5;

              beforeEach(async () => {
                await executeWithdrawalTask(
                  getWithdrawalExecutionData(payee.address, 0),
                  getWithdrawalModuleData(depositInfo.redeemTimestamp, taskInterval),
                );
                await time.increaseTo((await time.latest()) + taskInterval);
              });

              it("should increase the retry count correctly after retrying MAX_RETRY_COUNT-1 times", async () => {
                for (let i = 0; i < MAX_RETRY_COUNT - 1; i++) {
                  await executeWithdrawalTask(
                    getWithdrawalExecutionData(payee.address, 0),
                    getWithdrawalModuleData(depositInfo.redeemTimestamp, taskInterval),
                  );
                  await time.increaseTo((await time.latest()) + taskInterval);
                }

                const taskRetryCount = await pbmTaskManagerContract.taskRetries(taskId);

                expect(taskRetryCount).to.equal(5);
              });

              it("should revert if task is executed more than MAX_RETRY_COUNT times", async () => {
                // Because the task should already been cancelled when retried at MAX_RETRY_COUNT times
                for (let i = 0; i < MAX_RETRY_COUNT; i++) {
                  await executeWithdrawalTask(
                    getWithdrawalExecutionData(payee.address, 0),
                    getWithdrawalModuleData(depositInfo.redeemTimestamp, taskInterval),
                  );
                  await time.increaseTo((await time.latest()) + taskInterval);
                }

                const tx = executeWithdrawalTask(
                  getWithdrawalExecutionData(payee.address, 0),
                  getWithdrawalModuleData(depositInfo.redeemTimestamp, taskInterval),
                );

                await expect(tx).to.be.revertedWith("Automate.exec: Task not found");
              });

              describe("When a task is retried for MAX_RETRY_COUNT_TIMES", () => {
                beforeEach(async () => {
                  for (let i = 0; i < MAX_RETRY_COUNT; i++) {
                    await executeWithdrawalTask(
                      getWithdrawalExecutionData(payee.address, 0),
                      getWithdrawalModuleData(depositInfo.redeemTimestamp, taskInterval),
                    );
                    await time.increaseTo((await time.latest()) + taskInterval);
                  }
                });

                it("should cancel the retried task", async () => {
                  const tasksByTaskManager = await automateContract.getTaskIdsByUser(
                    pbmTaskManagerContract.address,
                  );

                  expect(tasksByTaskManager.length).to.equal(0);
                });

                it("should reset the task retry count", async () => {
                  const taskRetryCount = await pbmTaskManagerContract.taskRetries(taskId);

                  expect(taskRetryCount).to.equal(0);
                });

                it("should reset the task ID created record", async () => {
                  const isTaskIdCreated = await pbmTaskManagerContract.taskIds(taskId);

                  expect(isTaskIdCreated).to.equal(false);
                });
              });
            });
          });
        });
      });
    });
  });
});

const computeTaskInterval = (defaultInterval: number, depositId: number) => {
  return defaultInterval + (depositId % 120);
};

const getWithdrawalExecutionData = (payeeAddress: string, depositId: BigNumberish): string =>
  PBMTaskManager__factory.createInterface().encodeFunctionData("execWithdrawal", [
    payeeAddress,
    depositId,
  ]);

const getWithdrawalModuleData = (redeemTimestamp: BigNumber, taskInterval: BigNumberish) => {
  const timeArgs = ethers.utils.defaultAbiCoder.encode(
    ["uint256", "uint256"],
    [redeemTimestamp, taskInterval],
  );
  return {
    modules: [1, 2],
    args: [timeArgs, "0x"],
  };
};

const computeTaskId = (
  taskCreator: string,
  execAddress: string,
  execSelector: string,
  moduleData: IAutomate.ModuleDataStruct,
  feeToken: string,
): string => {
  const encoded = ethers.utils.defaultAbiCoder.encode(
    ["address", "address", "bytes4", "tuple(uint8[], bytes[])", "address"],
    [taskCreator, execAddress, execSelector, [moduleData.modules, moduleData.args], feeToken],
  );

  return ethers.utils.keccak256(encoded);
};
