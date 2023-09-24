/* Autogenerated file. Do not edit manually. */

/* tslint:disable */

/* eslint-disable */
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../common";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";

export interface PBMTaskManagerInterface extends utils.Interface {
  functions: {
    "INTERVAL()": FunctionFragment;
    "MAX_RETRIES()": FunctionFragment;
    "PBM()": FunctionFragment;
    "automate()": FunctionFragment;
    "cancelWithdrawalTask(uint256)": FunctionFragment;
    "createWithdrawalTask(address,uint256)": FunctionFragment;
    "dedicatedMsgSender()": FunctionFragment;
    "execWithdrawal(address,uint256)": FunctionFragment;
    "fundsOwner()": FunctionFragment;
    "getTaskId(uint256)": FunctionFragment;
    "taskIds(bytes32)": FunctionFragment;
    "taskRetries(bytes32)": FunctionFragment;
    "taskTreasury()": FunctionFragment;
    "withdrawETH(address)": FunctionFragment;
    "withdrawFunds(uint256,address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "INTERVAL"
      | "MAX_RETRIES"
      | "PBM"
      | "automate"
      | "cancelWithdrawalTask"
      | "createWithdrawalTask"
      | "dedicatedMsgSender"
      | "execWithdrawal"
      | "fundsOwner"
      | "getTaskId"
      | "taskIds"
      | "taskRetries"
      | "taskTreasury"
      | "withdrawETH"
      | "withdrawFunds"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "INTERVAL", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "MAX_RETRIES",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "PBM", values?: undefined): string;
  encodeFunctionData(functionFragment: "automate", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "cancelWithdrawalTask",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "createWithdrawalTask",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "dedicatedMsgSender",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "execWithdrawal",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "fundsOwner",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getTaskId",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "taskIds",
    values: [PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "taskRetries",
    values: [PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "taskTreasury",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawETH",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawFunds",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]
  ): string;

  decodeFunctionResult(functionFragment: "INTERVAL", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "MAX_RETRIES",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "PBM", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "automate", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "cancelWithdrawalTask",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "createWithdrawalTask",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "dedicatedMsgSender",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "execWithdrawal",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "fundsOwner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getTaskId", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "taskIds", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "taskRetries",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "taskTreasury",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawETH",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawFunds",
    data: BytesLike
  ): Result;

  events: {
    "WithdrawalTaskExecution(bytes32,bool)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "WithdrawalTaskExecution"): EventFragment;
}

export interface WithdrawalTaskExecutionEventObject {
  taskId: string;
  success: boolean;
}
export type WithdrawalTaskExecutionEvent = TypedEvent<
  [string, boolean],
  WithdrawalTaskExecutionEventObject
>;

export type WithdrawalTaskExecutionEventFilter =
  TypedEventFilter<WithdrawalTaskExecutionEvent>;

export interface PBMTaskManager extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: PBMTaskManagerInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    INTERVAL(overrides?: CallOverrides): Promise<[BigNumber]>;

    MAX_RETRIES(overrides?: CallOverrides): Promise<[number]>;

    PBM(overrides?: CallOverrides): Promise<[string]>;

    automate(overrides?: CallOverrides): Promise<[string]>;

    cancelWithdrawalTask(
      depositId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    createWithdrawalTask(
      payee: PromiseOrValue<string>,
      depositId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    dedicatedMsgSender(overrides?: CallOverrides): Promise<[string]>;

    execWithdrawal(
      payee: PromiseOrValue<string>,
      depositId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    fundsOwner(overrides?: CallOverrides): Promise<[string]>;

    getTaskId(
      depositId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    taskIds(
      arg0: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    taskRetries(
      arg0: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[number]>;

    taskTreasury(overrides?: CallOverrides): Promise<[string]>;

    withdrawETH(
      to: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    withdrawFunds(
      _amount: PromiseOrValue<BigNumberish>,
      _token: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  INTERVAL(overrides?: CallOverrides): Promise<BigNumber>;

  MAX_RETRIES(overrides?: CallOverrides): Promise<number>;

  PBM(overrides?: CallOverrides): Promise<string>;

  automate(overrides?: CallOverrides): Promise<string>;

  cancelWithdrawalTask(
    depositId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  createWithdrawalTask(
    payee: PromiseOrValue<string>,
    depositId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  dedicatedMsgSender(overrides?: CallOverrides): Promise<string>;

  execWithdrawal(
    payee: PromiseOrValue<string>,
    depositId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  fundsOwner(overrides?: CallOverrides): Promise<string>;

  getTaskId(
    depositId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;

  taskIds(
    arg0: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  taskRetries(
    arg0: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<number>;

  taskTreasury(overrides?: CallOverrides): Promise<string>;

  withdrawETH(
    to: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  withdrawFunds(
    _amount: PromiseOrValue<BigNumberish>,
    _token: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    INTERVAL(overrides?: CallOverrides): Promise<BigNumber>;

    MAX_RETRIES(overrides?: CallOverrides): Promise<number>;

    PBM(overrides?: CallOverrides): Promise<string>;

    automate(overrides?: CallOverrides): Promise<string>;

    cancelWithdrawalTask(
      depositId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    createWithdrawalTask(
      payee: PromiseOrValue<string>,
      depositId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    dedicatedMsgSender(overrides?: CallOverrides): Promise<string>;

    execWithdrawal(
      payee: PromiseOrValue<string>,
      depositId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    fundsOwner(overrides?: CallOverrides): Promise<string>;

    getTaskId(
      depositId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    taskIds(
      arg0: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    taskRetries(
      arg0: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<number>;

    taskTreasury(overrides?: CallOverrides): Promise<string>;

    withdrawETH(
      to: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    withdrawFunds(
      _amount: PromiseOrValue<BigNumberish>,
      _token: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "WithdrawalTaskExecution(bytes32,bool)"(
      taskId?: PromiseOrValue<BytesLike> | null,
      success?: PromiseOrValue<boolean> | null
    ): WithdrawalTaskExecutionEventFilter;
    WithdrawalTaskExecution(
      taskId?: PromiseOrValue<BytesLike> | null,
      success?: PromiseOrValue<boolean> | null
    ): WithdrawalTaskExecutionEventFilter;
  };

  estimateGas: {
    INTERVAL(overrides?: CallOverrides): Promise<BigNumber>;

    MAX_RETRIES(overrides?: CallOverrides): Promise<BigNumber>;

    PBM(overrides?: CallOverrides): Promise<BigNumber>;

    automate(overrides?: CallOverrides): Promise<BigNumber>;

    cancelWithdrawalTask(
      depositId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    createWithdrawalTask(
      payee: PromiseOrValue<string>,
      depositId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    dedicatedMsgSender(overrides?: CallOverrides): Promise<BigNumber>;

    execWithdrawal(
      payee: PromiseOrValue<string>,
      depositId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    fundsOwner(overrides?: CallOverrides): Promise<BigNumber>;

    getTaskId(
      depositId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    taskIds(
      arg0: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    taskRetries(
      arg0: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    taskTreasury(overrides?: CallOverrides): Promise<BigNumber>;

    withdrawETH(
      to: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    withdrawFunds(
      _amount: PromiseOrValue<BigNumberish>,
      _token: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    INTERVAL(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    MAX_RETRIES(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    PBM(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    automate(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    cancelWithdrawalTask(
      depositId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    createWithdrawalTask(
      payee: PromiseOrValue<string>,
      depositId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    dedicatedMsgSender(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    execWithdrawal(
      payee: PromiseOrValue<string>,
      depositId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    fundsOwner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getTaskId(
      depositId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    taskIds(
      arg0: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    taskRetries(
      arg0: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    taskTreasury(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    withdrawETH(
      to: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    withdrawFunds(
      _amount: PromiseOrValue<BigNumberish>,
      _token: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
