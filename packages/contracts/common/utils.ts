import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber, Contract } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";

import { ERC1967Proxy__factory } from "../types";
import { HardhatEthers } from "./types";

export const parseAmount = (amount: number, decimals: number = 18) => {
  return parseUnits(amount.toString(), decimals);
};

export const parseWei = (wei: BigNumber, decimals: number = 18) => {
  return formatUnits(wei, decimals);
};

export const deployUpgradeableContract = async <T extends Contract>(
  {
    deployer,
    contract,
    data,
  }: {
    deployer: SignerWithAddress;
    contract: T;
    data?: string;
  },
  ethers?: HardhatEthers,
) => {
  ethers = await resolveEthers(ethers);
  const proxiedContract = await (
    (await ethers.getContractFactory("ERC1967Proxy")) as ERC1967Proxy__factory
  )
    .connect(deployer)
    .deploy(contract.address, data ?? "0x");
  await proxiedContract.deployed();
  return contract.attach(proxiedContract.address) as T;
};

export const resolveEthers = async (ethers: HardhatEthers | undefined) => {
  return ethers || (await import("hardhat")).ethers;
};
