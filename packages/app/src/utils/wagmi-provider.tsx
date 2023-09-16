'use client'

import '@rainbow-me/rainbowkit/styles.css'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { infuraProvider } from "@wagmi/core/providers/infura";
import { publicProvider } from "@wagmi/core/providers/public";
import { connectorsForWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { injectedWallet, metaMaskWallet } from '@rainbow-me/rainbowkit/wallets'
import { getDefaultChains } from '@app/utils/helpers'

const { chains, provider, webSocketProvider } = configureChains(getDefaultChains(), [
    infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_API_KEY!, priority: 1 }),
    publicProvider({ priority: 2 }),
])

const defaultWalletParams = { chains, projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID! }

const connectors = connectorsForWallets([
    {
        groupName: 'Recommended',
        wallets: [
            metaMaskWallet(defaultWalletParams),
            injectedWallet(defaultWalletParams),
            // walletConnectWallet(defaultWalletParams),
        ],
    },
])

const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
    webSocketProvider,
})

export const WagmiRainbowKitProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider
                chains={chains}
                modalSize="compact"
                appInfo={{
                    appName: 'Project Orchid 🌸',
                    learnMoreUrl: 'https://www.monvogue.com',
                }}
            >
                {children}
            </RainbowKitProvider>
        </WagmiConfig>
    )
}
