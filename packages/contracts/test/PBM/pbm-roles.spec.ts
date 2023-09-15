import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";

import { PBM } from "../../types";
import { deployPBMFixture } from "./pbm.fixture";

describe("PBM - Roles", () => {
  let fixtures: Awaited<ReturnType<typeof deployPBMFixture>>;

  let pbmContract: PBM;

  beforeEach(async () => {
    fixtures = await loadFixture(deployPBMFixture);
    pbmContract = fixtures.pbmContract;
  });

  describe("Roles", async () => {
    let payee: SignerWithAddress;
    let payeeRole: string;

    beforeEach(async () => {
      payee = fixtures.signers.payee;
      payeeRole = fixtures.roles.payeeRole;
    });

    describe("When renouncing a role", () => {
      it("should not allow participants to voluntarily renounce their roles", async () => {
        const tx = pbmContract.connect(payee).renounceRole(payeeRole, payee.address);

        await expect(tx)
          .to.be.revertedWithCustomError(pbmContract, "RenounceRoleNotAllowed")
          .withArgs(payee.address, payeeRole);
      });
    });

    describe("When revoking a participant", () => {
      it("should allow admin to revoke a participant's role", async () => {
        await pbmContract.connect(fixtures.signers.admin).revokeRole(payeeRole, payee.address);

        const isPayee = await pbmContract.hasRole(payeeRole, payee.address);
        expect(isPayee).to.be.false;
      });

      it("should not allow a non-admin to revoke a participant's role", async () => {
        const nonAdmin = fixtures.signers.others[5];

        const tx = pbmContract.connect(nonAdmin).revokeRole(payeeRole, payee.address);

        await expect(tx).to.be.revertedWith(/AccessControl: account 0x\w* is missing role 0x\w*/);
      });
    });
  });
});
