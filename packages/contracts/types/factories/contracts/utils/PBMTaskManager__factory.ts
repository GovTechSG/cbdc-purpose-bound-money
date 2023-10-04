/* Autogenerated file. Do not edit manually. */

/* tslint:disable */

/* eslint-disable */
import type { PromiseOrValue } from "../../../common";
import type {
  PBMTaskManager,
  PBMTaskManagerInterface,
} from "../../../contracts/utils/PBMTaskManager";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_pbm",
        type: "address",
      },
      {
        internalType: "address payable",
        name: "_automate",
        type: "address",
      },
      {
        internalType: "address",
        name: "_fundsOwner",
        type: "address",
      },
    ],
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
    inputs: [],
    name: "INTERVAL",
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
  {
    inputs: [],
    name: "MAX_RETRIES",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "PBM",
    outputs: [
      {
        internalType: "contract IPBM",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "automate",
    outputs: [
      {
        internalType: "contract IAutomate",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "depositId",
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
        name: "payee",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "depositId",
        type: "uint256",
      },
    ],
    name: "createWithdrawalTask",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "dedicatedMsgSender",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "payee",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "depositId",
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
    inputs: [],
    name: "fundsOwner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "depositId",
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
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "taskIds",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "taskRetries",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "taskTreasury",
    outputs: [
      {
        internalType: "contract ITaskTreasuryUpgradable",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "withdrawETH",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
    ],
    name: "withdrawFunds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
] as const;

const _bytecode =
  "0x6101406040523480156200001257600080fd5b5060405162001a3438038062001a348339810160408190526200003591620001f8565b81818130816001600160a01b03166080816001600160a01b031681525050816001600160a01b031663573ea5756040518163ffffffff1660e01b8152600401602060405180830381865afa15801562000092573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190620000b891906200024c565b6001600160a01b0390811660c0526040516337b6269f60e21b8152908216600482015273c815db16d4be6ddf2685c201937905abf338f5d79063ded89a7c906024016040805180830381865afa15801562000117573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906200013d919062000273565b506001600160a01b0390811660a05283811660e0526080516040805163e60a321360e01b8152905191909216935063e60a3213925060048083019260209291908290030181865afa15801562000197573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190620001bd91906200024c565b6001600160a01b0390811661010052949094166101205250620002b692505050565b6001600160a01b0381168114620001f557600080fd5b50565b6000806000606084860312156200020e57600080fd5b83516200021b81620001df565b60208501519093506200022e81620001df565b60408501519092506200024181620001df565b809150509250925092565b6000602082840312156200025f57600080fd5b81516200026c81620001df565b9392505050565b600080604083850312156200028757600080fd5b82516200029481620001df565b60208401519092508015158114620002ab57600080fd5b809150509250929050565b60805160a05160c05160e05161010051610120516116c56200036f6000396000818161025c015281816106a2015281816107ec015281816108fc0152610b670152600081816102f301526106370152600081816101e6015281816104ee01528181610570015281816106000152610820015260008181610a730152610b3d01526000818161018b01526103a201526000818161010a015281816109c201528181610c8f01528181610efb0152610f9801526116c56000f3fe6080604052600436106100ec5760003560e01c806377b2b2ce1161008a578063e60a321311610059578063e60a3213146102e1578063e99fb04414610315578063ec122d0a14610345578063f5ff01bb1461036557600080fd5b806377b2b2ce1461024a57806389facb201461027e578063cd5a3b70146102a1578063d44bc088146102c157600080fd5b806346ebbdb0116100c657806346ebbdb0146101ad57806346ee3c59146101d4578063690d832014610208578063744bfe611461022a57600080fd5b8063049aacfe146100f85780630baddc9a1461014957806328f150eb1461017957600080fd5b366100f357005b600080fd5b34801561010457600080fd5b5061012c7f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b0390911681526020015b60405180910390f35b34801561015557600080fd5b5061016961016436600461125c565b610395565b6040519015158152602001610140565b34801561018557600080fd5b5061012c7f000000000000000000000000000000000000000000000000000000000000000081565b3480156101b957600080fd5b506101c2600581565b60405160ff9091168152602001610140565b3480156101e057600080fd5b5061012c7f000000000000000000000000000000000000000000000000000000000000000081565b34801561021457600080fd5b50610228610223366004611288565b6104e3565b005b34801561023657600080fd5b506102286102453660046112ac565b610565565b34801561025657600080fd5b5061012c7f000000000000000000000000000000000000000000000000000000000000000081565b34801561028a57600080fd5b5061029360b481565b604051908152602001610140565b3480156102ad57600080fd5b506102286102bc36600461125c565b610697565b3480156102cd57600080fd5b506102936102dc3660046112dc565b6107c5565b3480156102ed57600080fd5b5061012c7f000000000000000000000000000000000000000000000000000000000000000081565b34801561032157600080fd5b506101696103303660046112dc565b60006020819052908152604090205460ff1681565b34801561035157600080fd5b506101696103603660046112dc565b6107df565b34801561037157600080fd5b506101c26103803660046112dc565b60016020526000908152604090205460ff1681565b6000336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146104145760405162461bcd60e51b815260206004820152601960248201527f4f6e6c7920646564696361746564206d73672e73656e6465720000000000000060448201526064015b60405180910390fd5b61041e83836108a1565b9050600061042b836107c5565b905081156104415761043c81610988565b610492565b60008181526001602052604081208054829061045f9060ff1661130b565b91906101000a81548160ff021916908360ff16021790559050600560ff168160ff1611156104905761049082610988565b505b60008061049d6109bd565b915091506104ab8282610a4a565b6040518415159084907fd5f4ed018c0f63ae293a331b01a481632d320a61c69761c6e8042783adb32a8e90600090a350505092915050565b336001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161461052c5760405163135fb3eb60e11b815260040160405180910390fd5b6040516001600160a01b038216904780156108fc02916000818181858888f19350505050158015610561573d6000803e3d6000fd5b5050565b336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146105e95760405162461bcd60e51b815260206004820152602360248201527f4f6e6c792066756e6473206f776e65722063616e2077697468647261772066756044820152626e647360e81b606482015260840161040b565b604051631c20fadd60e01b81526001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000811660048301528281166024830152604482018490527f00000000000000000000000000000000000000000000000000000000000000001690631c20fadd90606401600060405180830381600087803b15801561067b57600080fd5b505af115801561068f573d6000803e3d6000fd5b505050505050565b336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146106e057604051630a4768dd60e21b815260040160405180910390fd5b60006106eb82610b62565b90506000806106fa8385610c68565b815260208101919091526040016000205460ff161561072c5760405163d2b40d0960e01b815260040160405180910390fd5b60006107388284610d30565b604080516001600160a01b038716602482015260448082018790528251808303909101815260649091019091526020810180516001600160e01b03166305d6ee4d60e11b17905290915060006107a430838573eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee610ee1565b6000908152602081905260409020805460ff19166001179055505050505050565b60006107d96107d383610b62565b83610c68565b92915050565b6000336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016148015906108435750336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614155b1561086157604051630166d47f60e11b815260040160405180910390fd5b600061086c836107c5565b60008181526020819052604090205490915060ff16156108985761088f81610988565b50600192915050565b50600092915050565b6040805160018082528183019092526000918291906020808301908036833701905050905082816000815181106108da576108da61132a565b6020908102919091010152604051638293744b60e01b81526001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001690638293744b906109339087908590600401611340565b6020604051808303816000875af192505050801561096e575060408051601f3d908101601f1916820190925261096b91810190611397565b60015b61097b5760009150610981565b50600191505b5092915050565b61099181610f82565b6000908152600160209081526040808320805460ff199081169091559183905290912080549091169055565b6000807f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663b810c6366040518163ffffffff1660e01b81526004016040805180830381865afa158015610a1d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a4191906113b0565b90939092509050565b73eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeed196001600160a01b03821601610b375760007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03168360405160006040518083038185875af1925050503d8060008114610adc576040519150601f19603f3d011682016040523d82523d6000602084013e610ae1565b606091505b5050905080610b325760405162461bcd60e51b815260206004820152601e60248201527f5f7472616e736665723a20455448207472616e73666572206661696c65640000604482015260640161040b565b505050565b610561817f000000000000000000000000000000000000000000000000000000000000000084610fff565b6000807f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663fbfa77cf6040518163ffffffff1660e01b8152600401602060405180830381865afa158015610bc3573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610be791906113d5565b6040516313f3f72d60e31b8152600481018590529091506001600160a01b03821690639f9fb96890602401606060405180830381865afa158015610c2f573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c5391906113f2565b6040015167ffffffffffffffff169392505050565b600080610c758484610d30565b6040516318a02bb760e11b81529091506001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001690633140576e90610ce790309081906305d6ee4d60e11b90879073eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee90600401611599565b602060405180830381865afa158015610d04573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d289190611397565b949350505050565b604080518082018252606080825260208201528151600281840181815260a0830190945291926000928291908160200160208202803683370190505081526040805160028082526060820190925260209092019190816020015b6060815260200190600190039081610d8a575050905280518051919250600191600090610db957610db961132a565b60200260200101906003811115610dd257610dd2611476565b90816003811115610de557610de5611476565b8152505060028160000151600181518110610e0257610e0261132a565b60200260200101906003811115610e1b57610e1b611476565b90816003811115610e2e57610e2e611476565b9052506000610e3e6078856115e8565b610e499060b461160a565b604080516fffffffffffffffffffffffffffffffff808916602083015283168183015281518082038301815260609091019091529091508260200151600081518110610e9757610e9761132a565b6020026020010181905250610eb760408051602081019091526000815290565b8260200151600181518110610ece57610ece61132a565b6020908102919091010152509392505050565b604051633323b46760e01b81526000906001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001690633323b46790610f3690889088908890889060040161161d565b6020604051808303816000875af1158015610f55573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f799190611397565b95945050505050565b60405163ee8ca3b560e01b8152600481018290527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03169063ee8ca3b590602401600060405180830381600087803b158015610fe457600080fd5b505af1158015610ff8573d6000803e3d6000fd5b5050505050565b604080516001600160a01b038416602482015260448082018490528251808303909101815260649091019091526020810180516001600160e01b031663a9059cbb60e01b179052610b3290849060006110a1826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b03166111219092919063ffffffff16565b90508051600014806110c25750808060200190518101906110c29190611667565b610b325760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b606482015260840161040b565b6060610d28848460008585600080866001600160a01b031685876040516111489190611689565b60006040518083038185875af1925050503d8060008114611185576040519150601f19603f3d011682016040523d82523d6000602084013e61118a565b606091505b509150915061119b878383876111a6565b979650505050505050565b6060831561121557825160000361120e576001600160a01b0385163b61120e5760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e7472616374000000604482015260640161040b565b5081610d28565b610d28838381511561122a5781518083602001fd5b8060405162461bcd60e51b815260040161040b91906116a5565b6001600160a01b038116811461125957600080fd5b50565b6000806040838503121561126f57600080fd5b823561127a81611244565b946020939093013593505050565b60006020828403121561129a57600080fd5b81356112a581611244565b9392505050565b600080604083850312156112bf57600080fd5b8235915060208301356112d181611244565b809150509250929050565b6000602082840312156112ee57600080fd5b5035919050565b634e487b7160e01b600052601160045260246000fd5b600060ff821660ff8103611321576113216112f5565b60010192915050565b634e487b7160e01b600052603260045260246000fd5b6000604082016001600160a01b03851683526020604081850152818551808452606086019150828701935060005b8181101561138a5784518352938301939183019160010161136e565b5090979650505050505050565b6000602082840312156113a957600080fd5b5051919050565b600080604083850312156113c357600080fd5b8251915060208301516112d181611244565b6000602082840312156113e757600080fd5b81516112a581611244565b60006060828403121561140457600080fd5b6040516060810167ffffffffffffffff828210818311171561143657634e487b7160e01b600052604160045260246000fd5b81604052845183526020850151915061144e82611244565b81602084015260408501519150808216821461146957600080fd5b5060408201529392505050565b634e487b7160e01b600052602160045260246000fd5b60005b838110156114a757818101518382015260200161148f565b50506000910152565b600081518084526114c881602086016020860161148c565b601f01601f19169290920160200192915050565b805160408084528151908401819052600091602091908201906060860190845b81811015611537578351600480821061152457634e487b7160e01b6000526021815260246000fd5b50835292840192918401916001016114fc565b505084830151868203878501528051808352908401925081840190600581901b8301850160005b8281101561158c57601f1985830301845261157a8287516114b0565b9587019593870193915060010161155e565b5098975050505050505050565b60006001600160a01b038088168352808716602084015263ffffffff60e01b8616604084015260a060608401526115d360a08401866114dc565b91508084166080840152509695505050505050565b60008261160557634e487b7160e01b600052601260045260246000fd5b500690565b808201808211156107d9576107d96112f5565b60006001600160a01b0380871683526080602084015261164060808401876114b0565b838103604085015261165281876114dc565b92505080841660608401525095945050505050565b60006020828403121561167957600080fd5b815180151581146112a557600080fd5b6000825161169b81846020870161148c565b9190910192915050565b6020815260006112a560208301846114b056fea164736f6c6343000813000a";

type PBMTaskManagerConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: PBMTaskManagerConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class PBMTaskManager__factory extends ContractFactory {
  constructor(...args: PBMTaskManagerConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _pbm: PromiseOrValue<string>,
    _automate: PromiseOrValue<string>,
    _fundsOwner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<PBMTaskManager> {
    return super.deploy(
      _pbm,
      _automate,
      _fundsOwner,
      overrides || {}
    ) as Promise<PBMTaskManager>;
  }
  override getDeployTransaction(
    _pbm: PromiseOrValue<string>,
    _automate: PromiseOrValue<string>,
    _fundsOwner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _pbm,
      _automate,
      _fundsOwner,
      overrides || {}
    );
  }
  override attach(address: string): PBMTaskManager {
    return super.attach(address) as PBMTaskManager;
  }
  override connect(signer: Signer): PBMTaskManager__factory {
    return super.connect(signer) as PBMTaskManager__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): PBMTaskManagerInterface {
    return new utils.Interface(_abi) as PBMTaskManagerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): PBMTaskManager {
    return new Contract(address, _abi, signerOrProvider) as PBMTaskManager;
  }
}