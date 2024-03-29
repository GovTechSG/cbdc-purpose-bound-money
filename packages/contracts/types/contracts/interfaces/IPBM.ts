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

export interface IPBMInterface extends utils.Interface {
  functions: {
    "asset()": FunctionFragment;
    "chargeback(address,uint256)": FunctionFragment;
    "pay(address,uint256,uint64,bool)": FunctionFragment;
    "redeem(uint256)": FunctionFragment;
    "refund(uint256)": FunctionFragment;
    "totalAsset()": FunctionFragment;
    "vault()": FunctionFragment;
    "withdraw(address,uint256[])": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "asset"
      | "chargeback"
      | "pay"
      | "redeem"
      | "refund"
      | "totalAsset"
      | "vault"
      | "withdraw"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "asset", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "chargeback",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "pay",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<boolean>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "redeem",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "refund",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "totalAsset",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "vault", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "withdraw",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>[]]
  ): string;

  decodeFunctionResult(functionFragment: "asset", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "chargeback", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "pay", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "redeem", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "refund", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "totalAsset", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "vault", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;

  events: {
    "EmergencyWithdrawal(address,address,uint256)": EventFragment;
    "Payment(address,address,uint256,uint64)": EventFragment;
    "Redemption(address,uint256)": EventFragment;
    "Refund(uint256,address,address,address,uint256)": EventFragment;
    "TaskManagerCancelWithdrawalFailed(address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "EmergencyWithdrawal"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Payment"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Redemption"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Refund"): EventFragment;
  getEvent(
    nameOrSignatureOrTopic: "TaskManagerCancelWithdrawalFailed"
  ): EventFragment;
}

export interface EmergencyWithdrawalEventObject {
  caller: string;
  recipient: string;
  amount: BigNumber;
}
export type EmergencyWithdrawalEvent = TypedEvent<
  [string, string, BigNumber],
  EmergencyWithdrawalEventObject
>;

export type EmergencyWithdrawalEventFilter =
  TypedEventFilter<EmergencyWithdrawalEvent>;

export interface PaymentEventObject {
  payer: string;
  payee: string;
  amount: BigNumber;
  lockPeriod: BigNumber;
}
export type PaymentEvent = TypedEvent<
  [string, string, BigNumber, BigNumber],
  PaymentEventObject
>;

export type PaymentEventFilter = TypedEventFilter<PaymentEvent>;

export interface RedemptionEventObject {
  redeemer: string;
  amount: BigNumber;
}
export type RedemptionEvent = TypedEvent<
  [string, BigNumber],
  RedemptionEventObject
>;

export type RedemptionEventFilter = TypedEventFilter<RedemptionEvent>;

export interface RefundEventObject {
  paymentId: BigNumber;
  payee: string;
  caller: string;
  payer: string;
  amount: BigNumber;
}
export type RefundEvent = TypedEvent<
  [BigNumber, string, string, string, BigNumber],
  RefundEventObject
>;

export type RefundEventFilter = TypedEventFilter<RefundEvent>;

export interface TaskManagerCancelWithdrawalFailedEventObject {
  payee: string;
  depositId: BigNumber;
}
export type TaskManagerCancelWithdrawalFailedEvent = TypedEvent<
  [string, BigNumber],
  TaskManagerCancelWithdrawalFailedEventObject
>;

export type TaskManagerCancelWithdrawalFailedEventFilter =
  TypedEventFilter<TaskManagerCancelWithdrawalFailedEvent>;

export interface IPBM extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IPBMInterface;

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
    asset(overrides?: CallOverrides): Promise<[string]>;

    chargeback(
      payee: PromiseOrValue<string>,
      paymentId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    pay(
      payee: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      lockPeriod: PromiseOrValue<BigNumberish>,
      autoWithdrawal: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    redeem(
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    refund(
      paymentId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    totalAsset(overrides?: CallOverrides): Promise<[BigNumber]>;

    vault(overrides?: CallOverrides): Promise<[string]>;

    withdraw(
      payee: PromiseOrValue<string>,
      depositIds: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  asset(overrides?: CallOverrides): Promise<string>;

  chargeback(
    payee: PromiseOrValue<string>,
    paymentId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  pay(
    payee: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    lockPeriod: PromiseOrValue<BigNumberish>,
    autoWithdrawal: PromiseOrValue<boolean>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  redeem(
    amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  refund(
    paymentId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  totalAsset(overrides?: CallOverrides): Promise<BigNumber>;

  vault(overrides?: CallOverrides): Promise<string>;

  withdraw(
    payee: PromiseOrValue<string>,
    depositIds: PromiseOrValue<BigNumberish>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    asset(overrides?: CallOverrides): Promise<string>;

    chargeback(
      payee: PromiseOrValue<string>,
      paymentId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    pay(
      payee: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      lockPeriod: PromiseOrValue<BigNumberish>,
      autoWithdrawal: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<void>;

    redeem(
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    refund(
      paymentId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    totalAsset(overrides?: CallOverrides): Promise<BigNumber>;

    vault(overrides?: CallOverrides): Promise<string>;

    withdraw(
      payee: PromiseOrValue<string>,
      depositIds: PromiseOrValue<BigNumberish>[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  filters: {
    "EmergencyWithdrawal(address,address,uint256)"(
      caller?: PromiseOrValue<string> | null,
      recipient?: PromiseOrValue<string> | null,
      amount?: null
    ): EmergencyWithdrawalEventFilter;
    EmergencyWithdrawal(
      caller?: PromiseOrValue<string> | null,
      recipient?: PromiseOrValue<string> | null,
      amount?: null
    ): EmergencyWithdrawalEventFilter;

    "Payment(address,address,uint256,uint64)"(
      payer?: PromiseOrValue<string> | null,
      payee?: PromiseOrValue<string> | null,
      amount?: null,
      lockPeriod?: null
    ): PaymentEventFilter;
    Payment(
      payer?: PromiseOrValue<string> | null,
      payee?: PromiseOrValue<string> | null,
      amount?: null,
      lockPeriod?: null
    ): PaymentEventFilter;

    "Redemption(address,uint256)"(
      redeemer?: PromiseOrValue<string> | null,
      amount?: null
    ): RedemptionEventFilter;
    Redemption(
      redeemer?: PromiseOrValue<string> | null,
      amount?: null
    ): RedemptionEventFilter;

    "Refund(uint256,address,address,address,uint256)"(
      paymentId?: PromiseOrValue<BigNumberish> | null,
      payee?: PromiseOrValue<string> | null,
      caller?: PromiseOrValue<string> | null,
      payer?: null,
      amount?: null
    ): RefundEventFilter;
    Refund(
      paymentId?: PromiseOrValue<BigNumberish> | null,
      payee?: PromiseOrValue<string> | null,
      caller?: PromiseOrValue<string> | null,
      payer?: null,
      amount?: null
    ): RefundEventFilter;

    "TaskManagerCancelWithdrawalFailed(address,uint256)"(
      payee?: PromiseOrValue<string> | null,
      depositId?: PromiseOrValue<BigNumberish> | null
    ): TaskManagerCancelWithdrawalFailedEventFilter;
    TaskManagerCancelWithdrawalFailed(
      payee?: PromiseOrValue<string> | null,
      depositId?: PromiseOrValue<BigNumberish> | null
    ): TaskManagerCancelWithdrawalFailedEventFilter;
  };

  estimateGas: {
    asset(overrides?: CallOverrides): Promise<BigNumber>;

    chargeback(
      payee: PromiseOrValue<string>,
      paymentId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    pay(
      payee: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      lockPeriod: PromiseOrValue<BigNumberish>,
      autoWithdrawal: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    redeem(
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    refund(
      paymentId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    totalAsset(overrides?: CallOverrides): Promise<BigNumber>;

    vault(overrides?: CallOverrides): Promise<BigNumber>;

    withdraw(
      payee: PromiseOrValue<string>,
      depositIds: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    asset(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    chargeback(
      payee: PromiseOrValue<string>,
      paymentId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    pay(
      payee: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      lockPeriod: PromiseOrValue<BigNumberish>,
      autoWithdrawal: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    redeem(
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    refund(
      paymentId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    totalAsset(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    vault(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    withdraw(
      payee: PromiseOrValue<string>,
      depositIds: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
