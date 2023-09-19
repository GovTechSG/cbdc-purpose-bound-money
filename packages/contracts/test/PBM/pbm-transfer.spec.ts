import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";

import { PBM } from "../../types";
import { parseAmount } from "../../common/utils";
import { deployPBMFixture } from "./pbm.fixture";

describe("PBM - Transfer", () => {
  let fixtures: Awaited<ReturnType<typeof deployPBMFixture>>;

  let pbmContract: PBM;

  beforeEach(async () => {
    fixtures = await loadFixture(deployPBMFixture);
    pbmContract = fixtures.pbmContract;
  });

  describe("Transfer", async () => {
    let payer: SignerWithAddress;
    let payee: SignerWithAddress;
    let targetRecipient: SignerWithAddress;

    const amount = parseAmount(500);

    beforeEach(async () => {
      payer = fixtures.signers.payer;
      payee = fixtures.signers.payee;
      targetRecipient = fixtures.signers.others[0];

      // Pay some PBM tokens to payee
      await pbmContract.connect(payer).pay(payee.address, amount, 0);
    });

    describe("When contract is not paused", () => {
      it("should allow transfer to anyone", async () => {
        await pbmContract.connect(payee).transfer(targetRecipient.address, amount);

        const payeeBalance = await pbmContract.balanceOf(payee.address);
        const targetRecipientBalance = await pbmContract.balanceOf(targetRecipient.address);

        expect(payeeBalance).to.equal(0);
        expect(targetRecipientBalance).to.equal(amount);
      });
    });

    describe("When the contract is paused", () => {
      beforeEach(async () => {
        await pbmContract.connect(fixtures.signers.admin).pause();
      });

      it("should revert when attempt to transfer", async () => {
        const tx = pbmContract.connect(payee).transfer(targetRecipient.address, amount);

        await expect(tx).to.be.revertedWith("Pausable: paused");
      });
    });
  });
});
