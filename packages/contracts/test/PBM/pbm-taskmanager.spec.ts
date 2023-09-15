import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";

import { PBMUpgradeable } from "../../types";
import { deployPBMFixture } from "./pbm.fixture";

describe("PBM - TaskManager", () => {
  let fixtures: Awaited<ReturnType<typeof deployPBMFixture>>;

  let pbmContract: PBMUpgradeable;
  let fakePbmTaskManagerAddress: string;

  let admin: SignerWithAddress;
  let payee: SignerWithAddress;

  beforeEach(async () => {
    fixtures = await loadFixture(deployPBMFixture);
    pbmContract = fixtures.pbmContract;
    fakePbmTaskManagerAddress = fixtures.signers.others[0].address;

    admin = fixtures.signers.admin;
    payee = fixtures.signers.payee;
  });

  describe("When setting the task manager", () => {
    it("should allow admin to set a task manager address", async () => {
      await pbmContract.connect(admin).setTaskManager(fakePbmTaskManagerAddress);

      const taskManager = await pbmContract.taskManager();

      expect(taskManager).to.be.equal(fakePbmTaskManagerAddress);
    });

    it("should allow admin to set task manager to zero address", async () => {
      // Assert that the task manager is not the zero address
      await pbmContract.connect(admin).setTaskManager(fakePbmTaskManagerAddress);
      let taskManager = await pbmContract.taskManager();
      expect(taskManager).to.be.equal(fakePbmTaskManagerAddress);

      // Set the task manager to the zero address
      await pbmContract.connect(admin).setTaskManager(ethers.constants.AddressZero);
      taskManager = await pbmContract.taskManager();

      expect(taskManager).to.be.equal(ethers.constants.AddressZero);
    });

    it("should revert if caller is not an admin", async () => {
      const tx = pbmContract.connect(payee).setTaskManager(fakePbmTaskManagerAddress);

      await expect(tx)
        .to.be.revertedWithCustomError(pbmContract, "UnauthorisedCaller")
        .withArgs(payee.address, fixtures.roles.adminRole);
    });
  });
});
