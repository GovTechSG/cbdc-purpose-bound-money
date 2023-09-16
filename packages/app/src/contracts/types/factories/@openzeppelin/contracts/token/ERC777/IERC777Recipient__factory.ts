/* Autogenerated file. Do not edit manually. */

/* tslint:disable */

/* eslint-disable */
import type {
  IERC777Recipient,
  IERC777RecipientInterface,
} from "../../../../../@openzeppelin/contracts/token/ERC777/IERC777Recipient";
import type { Provider } from "@ethersproject/providers";
import { Contract, Signer, utils } from "ethers";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "userData",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "operatorData",
        type: "bytes",
      },
    ],
    name: "tokensReceived",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class IERC777Recipient__factory {
  static readonly abi = _abi;
  static createInterface(): IERC777RecipientInterface {
    return new utils.Interface(_abi) as IERC777RecipientInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IERC777Recipient {
    return new Contract(address, _abi, signerOrProvider) as IERC777Recipient;
  }
}
