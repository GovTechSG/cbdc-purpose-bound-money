import { HardhatEthers } from "../../common/types";

const getLedgerAccount = (): string | false => {
  if (process.env.USE_HARDWARE_WALLET !== "1") return false;
  const ledgerAccount = process.env.HARDWARE_WALLET_ADDRESS;
  if (!ledgerAccount) {
    throw new Error(
      "You've indicated to use hardware wallet. Please set your HARDWARE_WALLET_ADDRESS in a .env file",
    );
  }
  return ledgerAccount;
};

export const getDefaultSigner = async (ethers: HardhatEthers) => {
  const ledgerAccount = getLedgerAccount();
  return ledgerAccount ? ethers.getSigner(ledgerAccount) : (await ethers.getSigners())[0];
};
