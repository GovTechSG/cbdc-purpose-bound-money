/* Autogenerated file. Do not edit manually. */

/* tslint:disable */

/* eslint-disable */
import type { PromiseOrValue } from "../../../../../common";
import type {
  NonceManager,
  NonceManagerInterface,
} from "../../../../../contracts/account-abstraction/lib/core/NonceManager";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "uint192",
        name: "key",
        type: "uint192",
      },
    ],
    name: "getNonce",
    outputs: [
      {
        internalType: "uint256",
        name: "nonce",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint192",
        name: "key",
        type: "uint192",
      },
    ],
    name: "incrementNonce",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint192",
        name: "",
        type: "uint192",
      },
    ],
    name: "nonceSequenceNumber",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b506101cc806100206000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c80630bd28e3b146100465780631b2e01b81461005b57806335567e1a14610095575b600080fd5b610059610054366004610135565b6100e4565b005b610083610069366004610157565b600060208181529281526040808220909352908152205481565b60405190815260200160405180910390f35b6100836100a3366004610157565b6001600160a01b03919091166000908152602081815260408083206001600160c01b0385168452909152908190205491901b67ffffffffffffffff19161790565b336000908152602081815260408083206001600160c01b0385168452909152812080549161011183610198565b919050555050565b80356001600160c01b038116811461013057600080fd5b919050565b60006020828403121561014757600080fd5b61015082610119565b9392505050565b6000806040838503121561016a57600080fd5b82356001600160a01b038116811461018157600080fd5b915061018f60208401610119565b90509250929050565b6000600182016101b857634e487b7160e01b600052601160045260246000fd5b506001019056fea164736f6c6343000811000a";

type NonceManagerConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: NonceManagerConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class NonceManager__factory extends ContractFactory {
  constructor(...args: NonceManagerConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<NonceManager> {
    return super.deploy(overrides || {}) as Promise<NonceManager>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): NonceManager {
    return super.attach(address) as NonceManager;
  }
  override connect(signer: Signer): NonceManager__factory {
    return super.connect(signer) as NonceManager__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): NonceManagerInterface {
    return new utils.Interface(_abi) as NonceManagerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): NonceManager {
    return new Contract(address, _abi, signerOrProvider) as NonceManager;
  }
}
