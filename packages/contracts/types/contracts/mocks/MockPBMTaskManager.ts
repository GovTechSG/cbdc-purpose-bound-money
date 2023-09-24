/* Autogenerated file. Do not edit manually. */

/* tslint:disable */

/* eslint-disable */
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../common";
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

export interface MockPBMTaskManagerInterface extends utils.Interface {
  functions: {
    "cancelWithdrawalTask(uint256)": FunctionFragment;
    "createWithdrawalTask(address,uint256)": FunctionFragment;
    "execWithdrawal(address,uint256)": FunctionFragment;
    "getTaskId(uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "cancelWithdrawalTask"
      | "createWithdrawalTask"
      | "execWithdrawal"
      | "getTaskId"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "cancelWithdrawalTask",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "createWithdrawalTask",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "execWithdrawal",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getTaskId",
    values: [PromiseOrValue<BigNumberish>]
  ): string;

  decodeFunctionResult(
    functionFragment: "cancelWithdrawalTask",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "createWithdrawalTask",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "execWithdrawal",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getTaskId", data: BytesLike): Result;

  events: {
    "TaskCancelled()": EventFragment;
    "TaskCreated()": EventFragment;
    "WithdrawalTaskExecution(bytes32,bool)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "TaskCancelled"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TaskCreated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "WithdrawalTaskExecution"): EventFragment;
}

export interface TaskCancelledEventObject {}
export type TaskCancelledEvent = TypedEvent<[], TaskCancelledEventObject>;

export type TaskCancelledEventFilter = TypedEventFilter<TaskCancelledEvent>;

export interface TaskCreatedEventObject {}
export type TaskCreatedEvent = TypedEvent<[], TaskCreatedEventObject>;

export type TaskCreatedEventFilter = TypedEventFilter<TaskCreatedEvent>;

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

export interface MockPBMTaskManager extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: MockPBMTaskManagerInterface;

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
    cancelWithdrawalTask(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    createWithdrawalTask(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    execWithdrawal(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getTaskId(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string]>;
  };

  cancelWithdrawalTask(
    arg0: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  createWithdrawalTask(
    arg0: PromiseOrValue<string>,
    arg1: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  execWithdrawal(
    arg0: PromiseOrValue<string>,
    arg1: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getTaskId(
    arg0: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;

  callStatic: {
    cancelWithdrawalTask(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    createWithdrawalTask(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    execWithdrawal(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    getTaskId(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;
  };

  filters: {
    "TaskCancelled()"(): TaskCancelledEventFilter;
    TaskCancelled(): TaskCancelledEventFilter;

    "TaskCreated()"(): TaskCreatedEventFilter;
    TaskCreated(): TaskCreatedEventFilter;

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
    cancelWithdrawalTask(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    createWithdrawalTask(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    execWithdrawal(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getTaskId(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    cancelWithdrawalTask(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    createWithdrawalTask(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    execWithdrawal(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getTaskId(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
