import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";

import { parseAmount } from "../../common/utils";
import { DSGD, PBMUpgradeable, PBMVault } from "../../types";
import { PBMFixtureParamType, deployPBMFixture } from "./pbm.fixture";

describe("PBM - Setup", () => {
  let fixtures: Awaited<ReturnType<typeof deployPBMFixture>>;

  let pbmContract: PBMUpgradeable;
  let pbmVaultContract: PBMVault;
  let dsgdContract: DSGD;

  let pbmParams: PBMFixtureParamType;
  let deployer: SignerWithAddress;
  let admin: SignerWithAddress;

  beforeEach(async () => {
    fixtures = await loadFixture(deployPBMFixture);
    pbmContract = fixtures.pbmContract;
    pbmVaultContract = fixtures.pbmVaultContract;
    dsgdContract = fixtures.dsgdContract;

    deployer = fixtures.signers.deployer;
    admin = fixtures.signers.admin;

    pbmParams = fixtures.pbmDefaultParams;
  });

  describe("Setup", function () {
    describe("When setting up admin roles", () => {
      it("should grant deployer as admin", async () => {
        const adminRole = await pbmContract.DEFAULT_ADMIN_ROLE();
        const res = await pbmContract.hasRole(adminRole, deployer.address);

        expect(res).to.be.true;
      });

      it("should grant deployer as treasurer", async () => {
        const treasurerRole = await pbmContract.TREASURER_ROLE();
        const res = await pbmContract.hasRole(treasurerRole, deployer.address);

        expect(res).to.be.true;
      });

      it("should grant deployer as payee", async () => {
        const payeeRole = await pbmContract.PAYEE_ROLE();
        const res = await pbmContract.hasRole(payeeRole, deployer.address);

        expect(res).to.be.true;
      });
    });

    describe("When setting up PBM token", () => {
      it("should have the correct token name", async () => {
        const res = await pbmContract.name();

        expect(res).to.be.equal(pbmParams.name);
      });

      it("should have the correct token symbol", async () => {
        const res = await pbmContract.symbol();

        expect(res).to.be.equal(pbmParams.symbol);
      });

      it("should have the correct decimals", async () => {
        const dsgdDecimals = await dsgdContract.decimals();
        const pbmDecimals = await pbmContract.decimals();

        expect(pbmDecimals).to.be.equal(dsgdDecimals);
      });
    });

    describe("When setting up the underlying asset of PBM", () => {
      it("should return the correct asset address", async () => {
        it("should have the correct asset", async () => {
          const res = await pbmContract.asset();

          expect(res).to.be.equal(dsgdContract.address);
        });
      });

      it("should return the correct total asset balance", async () => {
        await dsgdContract.mint(pbmContract.address, parseAmount(8888));

        const res = await pbmContract.totalAsset();

        expect(res.toString()).to.be.equal(parseAmount(8888).toString());
      });
    });

    describe("When setting up the PBM vault", () => {
      describe("When setting PBM as asset in PBM vault", () => {
        beforeEach(async () => {
          // Reset PBM address on vault to zero before each test
          await pbmVaultContract.connect(deployer).setPBM(ethers.constants.AddressZero);
          const res = await pbmVaultContract.asset();
          // Assert that PBM address is zero
          expect(res).to.be.equal(ethers.constants.AddressZero);
        });

        it("should revert if caller is not deployer", async () => {
          const tx = pbmVaultContract.connect(admin).setPBM(pbmContract.address);

          await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("should set PBM address as asset in PBM vault if caller is deployer", async () => {
          await pbmVaultContract.connect(deployer).setPBM(pbmContract.address);

          const asset = await pbmVaultContract.asset();

          expect(asset).to.be.equal(pbmContract.address);
        });

        it("should revert with AssetNotSet when reading decimals without PBM set", async () => {
          const tx = pbmVaultContract.decimals();

          await expect(tx).to.be.revertedWithCustomError(pbmVaultContract, "AssetNotSet");
        });
      });

      describe("When PBM is already set as asset in PBM vault", () => {
        it("should have the same decimals as PBM token", async () => {
          const pbmVaultDecimals = await pbmVaultContract.decimals();
          const pbmDecimals = await pbmContract.decimals();

          expect(pbmVaultDecimals).to.be.equal(pbmDecimals);
        });

        it("should have the same decimals as the underlying asset of PBM", async () => {
          const pbmVaultDecimals = await pbmVaultContract.decimals();
          const dsgdDecimals = await dsgdContract.decimals();

          expect(pbmVaultDecimals).to.be.equal(dsgdDecimals);
        });

        describe("When calling on the functions in the PBM vault", () => {
          let payer: SignerWithAddress;
          let payee: SignerWithAddress;

          beforeEach(async () => {
            payer = fixtures.signers.payer;
            payee = fixtures.signers.payee;
          });

          it("should revert if non-PBM caller attempts to deposit", async () => {
            const tx = pbmVaultContract
              .connect(deployer)
              .deposit(payer.address, payee.address, 100, 300);

            await expect(tx).to.be.revertedWithCustomError(pbmVaultContract, "CallerNotPBM");
          });

          it("should revert if non-PBM caller attempts to withdraw", async () => {
            const tx = pbmVaultContract.connect(deployer).withdraw(payee.address, [0]);

            await expect(tx).to.be.revertedWithCustomError(pbmVaultContract, "CallerNotPBM");
          });

          it("should revert if non-PBM caller attempts to refund", async () => {
            const tx = pbmVaultContract.connect(deployer).refund(payee.address, 0);

            await expect(tx).to.be.revertedWithCustomError(pbmVaultContract, "CallerNotPBM");
          });
        });
      });
    });

    describe("Proxy Setup", () => {
      let newPbmContract: PBMUpgradeable;
      let newPbmVaultContract: PBMVault;

      let initName: string;
      let initSymbol: string;

      beforeEach(async () => {
        initName = "New PBM";
        initSymbol = "NEWPBM";
        newPbmContract = (await (
          await ethers.getContractFactory("PBMUpgradeable")
        ).deploy(initName, initSymbol)) as PBMUpgradeable;

        newPbmVaultContract = (await (
          await ethers.getContractFactory("PBMVault")
        ).deploy(initName, initSymbol)) as PBMVault;
      });

      describe("When initialising implementations", () => {
        describe("When contract is PBM", () => {
          it("should revert when initialise", async () => {
            const tx = newPbmContract
              .connect(deployer)
              .initialize(pbmParams.name, pbmParams.symbol, dsgdContract.address, pbmParams.vault);

            await expect(tx).to.be.revertedWith("Initializable: contract is already initialized");
          });

          it("should initialise with default values", async () => {
            const [name, symbol, asset, vault] = await Promise.all([
              newPbmContract.name(),
              newPbmContract.symbol(),
              newPbmContract.asset(),
              newPbmContract.vault(),
            ]);

            expect(name).to.be.equal(initName);
            expect(symbol).to.be.equal(initSymbol);
            expect(asset).to.be.equal(ethers.constants.AddressZero);
            expect(vault).to.be.equal(ethers.constants.AddressZero);
          });
        });

        describe("When contract is PBMVault", () => {
          it("should revert when initialise PBMVault contract", async () => {
            const tx = newPbmVaultContract
              .connect(deployer)
              .initialize(pbmParams.name, pbmParams.symbol);

            await expect(tx).to.be.revertedWith("Initializable: contract is already initialized");
          });

          it("should initialise with default values", async () => {
            const [name, symbol] = await Promise.all([
              newPbmVaultContract.name(),
              newPbmVaultContract.symbol(),
            ]);

            expect(name).to.be.equal(initName);
            expect(symbol).to.be.equal(initSymbol);
          });
        });
      });

      describe("When upgrading the contract", () => {
        describe("When caller to upgrade is not an admin", () => {
          describe("When contract is PBM", () => {
            it("should revert if caller is not an admin", async () => {
              const nonAdminSigner = fixtures.signers.others[0];

              const tx = pbmContract.connect(nonAdminSigner).upgradeTo(newPbmContract.address);

              await expect(tx)
                .to.be.revertedWithCustomError(pbmContract, "UnauthorisedCaller")
                .withArgs(nonAdminSigner.address, fixtures.roles.adminRole);
            });
          });

          describe("When contract is PBMVault", () => {
            it("should revert in PBMVault contract if caller is not an admin", async () => {
              const nonAdminSigner = fixtures.signers.others[0];

              const tx = pbmVaultContract.connect(nonAdminSigner).upgradeTo(newPbmContract.address);

              await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
            });
          });
        });

        describe("When caller to upgrade is an admin", () => {
          const implSlot = "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc";

          describe("When contract is PBM", () => {
            it("should revert when attempt to re-initialise PBM contract", async () => {
              const upgradeData = newPbmContract.interface.encodeFunctionData("initialize", [
                pbmParams.name,
                pbmParams.symbol,
                dsgdContract.address,
                pbmParams.vault,
              ]);

              const tx = pbmContract
                .connect(admin)
                .upgradeToAndCall(newPbmContract.address, upgradeData);

              await expect(tx).to.be.revertedWith("Initializable: contract is already initialized");
            });

            it("should upgrade to new contract if caller is an admin", async () => {
              await pbmContract.connect(admin).upgradeTo(newPbmContract.address);

              const value = await pbmContract.provider.getStorageAt(pbmContract.address, implSlot);
              const impl = ethers.utils.getAddress(value.slice(-40));

              await expect(impl).to.be.equal(newPbmContract.address);
            });
          });

          describe("When contract is PBMVault", () => {
            let pbmVaultOwner: SignerWithAddress;

            beforeEach(async () => {
              // Caveat: PBMVault contract owner is deployer
              pbmVaultOwner = fixtures.signers.deployer;
            });

            it("should revert when attempt to re-initialise PBMVault contract", async () => {
              const upgradeData = newPbmVaultContract.interface.encodeFunctionData("initialize", [
                pbmParams.name,
                pbmParams.symbol,
              ]);

              const tx = pbmVaultContract
                .connect(pbmVaultOwner)
                .upgradeToAndCall(newPbmVaultContract.address, upgradeData);

              await expect(tx).to.be.revertedWith("Initializable: contract is already initialized");
            });

            describe("When upgrade to new contract", () => {
              it("should revert if caller is admin", async () => {
                const tx = pbmVaultContract.connect(admin).upgradeTo(newPbmVaultContract.address);

                await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
              });

              it("should revert during upgrade if caller is an admin", async () => {
                // Caveat: PBMVault contract owner is not admin
                const tx = pbmVaultContract.connect(admin).upgradeTo(newPbmVaultContract.address);

                await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
              });

              it("should upgrade to new contract if caller is owner", async () => {
                await pbmVaultContract
                  .connect(pbmVaultOwner)
                  .upgradeTo(newPbmVaultContract.address);

                const value = await pbmVaultContract.provider.getStorageAt(
                  pbmVaultContract.address,
                  implSlot,
                );
                const impl = ethers.utils.getAddress(value.slice(-40));

                await expect(impl).to.be.equal(newPbmVaultContract.address);
              });
            });
          });
        });
      });
    });
  });
});
