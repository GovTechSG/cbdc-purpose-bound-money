/* Autogenerated file. Do not edit manually. */

/* tslint:disable */

/* eslint-disable */
import type { PromiseOrValue } from "../../../common";
import type {
  MockPBMTaskManager,
  MockPBMTaskManagerInterface,
} from "../../../contracts/mocks/MockPBMTaskManager";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "CallerNotFundsOwner",
    type: "error",
  },
  {
    inputs: [],
    name: "TaskCallerNotPBM",
    type: "error",
  },
  {
    inputs: [],
    name: "TaskExists",
    type: "error",
  },
  {
    inputs: [],
    name: "UnauthorisedCaller",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [],
    name: "TaskCancelled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [],
    name: "TaskCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "taskId",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    name: "WithdrawalTaskExecution",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "cancelWithdrawalTask",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
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
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "createWithdrawalTask",
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
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "execWithdrawal",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "getTaskId",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b506101c4806100206000396000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c80630baddc9a14610051578063cd5a3b7014610079578063d44bc0881461008e578063ec122d0a146100b0575b600080fd5b61006461005f366004610159565b6100c3565b60405190151581526020015b60405180910390f35b61008c610087366004610159565b6100f9565b005b6100a261009c36600461019e565b50600090565b604051908152602001610070565b6100646100be36600461019e565b610126565b60405160019081906000907fd5f4ed018c0f63ae293a331b01a481632d320a61c69761c6e8042783adb32a8e908290a392915050565b6040517f415551df8aedc98e907398f6e6cc4c006fb58dd57af48230df66867ec85ca35d90600090a15050565b6040516000907f956c4cca61ba91ff02e91bd6fc092639bbc532e8b803d619b2049d9622926cdd908290a1506001919050565b6000806040838503121561016c57600080fd5b823573ffffffffffffffffffffffffffffffffffffffff8116811461019057600080fd5b946020939093013593505050565b6000602082840312156101b057600080fd5b503591905056fea164736f6c6343000813000a";

type MockPBMTaskManagerConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MockPBMTaskManagerConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class MockPBMTaskManager__factory extends ContractFactory {
  constructor(...args: MockPBMTaskManagerConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<MockPBMTaskManager> {
    return super.deploy(overrides || {}) as Promise<MockPBMTaskManager>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): MockPBMTaskManager {
    return super.attach(address) as MockPBMTaskManager;
  }
  override connect(signer: Signer): MockPBMTaskManager__factory {
    return super.connect(signer) as MockPBMTaskManager__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MockPBMTaskManagerInterface {
    return new utils.Interface(_abi) as MockPBMTaskManagerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MockPBMTaskManager {
    return new Contract(address, _abi, signerOrProvider) as MockPBMTaskManager;
  }
}
