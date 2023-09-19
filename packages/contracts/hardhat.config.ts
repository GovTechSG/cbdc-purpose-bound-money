import "@nomicfoundation/hardhat-ledger";
import "@nomicfoundation/hardhat-toolbox";
import { config as dotenvConfig } from "dotenv";
import "hardhat-watcher";
import type { HardhatUserConfig } from "hardhat/config";
import { HttpNetworkUserConfig } from "hardhat/src/types/config";
import type { NetworkUserConfig } from "hardhat/types";
import { HardhatNetworkUserConfig } from "hardhat/types/config";
import { resolve } from "path";

import "./tasks";
import "./tasks/accounts";

const dotenvConfigPath: string = process.env.DOTENV_CONFIG_PATH || "./.env";
dotenvConfig({ path: resolve(__dirname, dotenvConfigPath) });

// Ensure that we have all the environment variables we need.
const mnemonic: string | undefined = process.env.MNEMONIC;
const activeSignerPk: string | undefined = process.env.ACTIVE_SIGNER_PK;
if (!mnemonic && !activeSignerPk) {
  throw new Error("Please set your MNEMONIC or ACTIVE_SIGNER_PK in a .env file");
}

const infuraApiKey: string | undefined = process.env.INFURA_API_KEY;
if (!infuraApiKey) {
  throw new Error("Please set your INFURA_API_KEY in a .env file");
}

const chainIds = {
  "arbitrum-mainnet": 42161,
  avalanche: 43114,
  bsc: 56,
  hardhat: 31337,
  mainnet: 1,
  "optimism-mainnet": 10,
  "polygon-mainnet": 137,
  "polygon-mumbai": 80001,
  sepolia: 11155111,
};

function getAccounts(): HttpNetworkUserConfig["accounts"] {
  return activeSignerPk
    ? [activeSignerPk]
    : {
        count: 10,
        mnemonic: mnemonic!,
        path: "m/44'/60'/0'/0",
      };
}

function getLedgerAccounts(): HardhatNetworkUserConfig["ledgerAccounts"] | undefined {
  if (process.env.USE_HARDWARE_WALLET !== "1") return;
  const ledgerAccount = process.env.HARDWARE_WALLET_ADDRESS;
  if (!ledgerAccount) {
    throw new Error(
      "You've indicated to use hardware wallet. Please set your HARDWARE_WALLET_ADDRESS in a .env file",
    );
  }
  return [ledgerAccount];
}

function getAccountOrLedger() {
  // Prioritise ledger account if available
  const ledgerAccounts = getLedgerAccounts();
  if (ledgerAccounts) {
    return { ledgerAccounts };
  }
  return { accounts: getAccounts() };
}

function getChainConfig(chain: keyof typeof chainIds): NetworkUserConfig {
  let jsonRpcUrl: string;
  switch (chain) {
    case "avalanche":
      jsonRpcUrl = "https://api.avax.network/ext/bc/C/rpc";
      break;
    case "bsc":
      jsonRpcUrl = "https://bsc-dataseed1.binance.org";
      break;
    default:
      jsonRpcUrl = "https://" + chain + ".infura.io/v3/" + infuraApiKey;
  }
  return {
    ...getAccountOrLedger(),
    chainId: chainIds[chain],
    url: jsonRpcUrl,
  };
}

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  etherscan: {
    apiKey: {
      arbitrumOne: process.env.ARBISCAN_API_KEY || "",
      avalanche: process.env.SNOWTRACE_API_KEY || "",
      bsc: process.env.BSCSCAN_API_KEY || "",
      mainnet: process.env.ETHERSCAN_API_KEY || "",
      optimisticEthereum: process.env.OPTIMISM_API_KEY || "",
      polygon: process.env.POLYGONSCAN_API_KEY || "",
      polygonMumbai: process.env.POLYGONSCAN_API_KEY || "",
      sepolia: process.env.ETHERSCAN_API_KEY || "",
    },
  },
  gasReporter: {
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY || "",
    enabled: !!process.env.REPORT_GAS,
    excludeContracts: [],
    src: "./contracts",
  },
  networks: {
    hardhat: {
      accounts: {
        mnemonic,
      },
      ledgerAccounts: getLedgerAccounts(),
      chainId: chainIds.hardhat,
    },
    arbitrum: getChainConfig("arbitrum-mainnet"),
    avalanche: getChainConfig("avalanche"),
    bsc: getChainConfig("bsc"),
    mainnet: getChainConfig("mainnet"),
    optimism: getChainConfig("optimism-mainnet"),
    "polygon-mainnet": getChainConfig("polygon-mainnet"),
    "polygon-mumbai": getChainConfig("polygon-mumbai"),
    sepolia: getChainConfig("sepolia"),
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
  solidity: {
    version: "0.8.19",
    settings: {
      metadata: {
        // Not including the metadata hash
        // https://github.com/paulrberg/hardhat-template/issues/31
        bytecodeHash: "none",
      },
      // Disable the optimizer when debugging
      // https://hardhat.org/hardhat-network/#solidity-optimizer-support
      optimizer: {
        enabled: true,
        runs: 288,
      },
    },
  },
  typechain: {
    outDir: "types",
    target: "ethers-v5",
  },
  watcher: {
    test: {
      tasks: ["compile", "test"],
      files: ["./contracts", "./test"],
    },
  },
};

export default config;
