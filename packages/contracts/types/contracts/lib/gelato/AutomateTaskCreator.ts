/* Autogenerated file. Do not edit manually. */

/* tslint:disable */

/* eslint-disable */
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../../common";
import type { FunctionFragment, Result } from "@ethersproject/abi";
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

export interface AutomateTaskCreatorInterface extends utils.Interface {
  functions: {
    "automate()": FunctionFragment;
    "dedicatedMsgSender()": FunctionFragment;
    "fundsOwner()": FunctionFragment;
    "taskTreasury()": FunctionFragment;
    "withdrawFunds(uint256,address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "automate"
      | "dedicatedMsgSender"
      | "fundsOwner"
      | "taskTreasury"
      | "withdrawFunds"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "automate", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "dedicatedMsgSender",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "fundsOwner",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "taskTreasury",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawFunds",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]
  ): string;

  decodeFunctionResult(functionFragment: "automate", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "dedicatedMsgSender",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "fundsOwner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "taskTreasury",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawFunds",
    data: BytesLike
  ): Result;

  events: {};
}

export interface AutomateTaskCreator extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: AutomateTaskCreatorInterface;

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
    automate(overrides?: CallOverrides): Promise<[string]>;

    dedicatedMsgSender(overrides?: CallOverrides): Promise<[string]>;

    fundsOwner(overrides?: CallOverrides): Promise<[string]>;

    taskTreasury(overrides?: CallOverrides): Promise<[string]>;

    withdrawFunds(
      _amount: PromiseOrValue<BigNumberish>,
      _token: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  automate(overrides?: CallOverrides): Promise<string>;

  dedicatedMsgSender(overrides?: CallOverrides): Promise<string>;

  fundsOwner(overrides?: CallOverrides): Promise<string>;

  taskTreasury(overrides?: CallOverrides): Promise<string>;

  withdrawFunds(
    _amount: PromiseOrValue<BigNumberish>,
    _token: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    automate(overrides?: CallOverrides): Promise<string>;

    dedicatedMsgSender(overrides?: CallOverrides): Promise<string>;

    fundsOwner(overrides?: CallOverrides): Promise<string>;

    taskTreasury(overrides?: CallOverrides): Promise<string>;

    withdrawFunds(
      _amount: PromiseOrValue<BigNumberish>,
      _token: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    automate(overrides?: CallOverrides): Promise<BigNumber>;

    dedicatedMsgSender(overrides?: CallOverrides): Promise<BigNumber>;

    fundsOwner(overrides?: CallOverrides): Promise<BigNumber>;

    taskTreasury(overrides?: CallOverrides): Promise<BigNumber>;

    withdrawFunds(
      _amount: PromiseOrValue<BigNumberish>,
      _token: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    automate(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    dedicatedMsgSender(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    fundsOwner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    taskTreasury(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    withdrawFunds(
      _amount: PromiseOrValue<BigNumberish>,
      _token: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}