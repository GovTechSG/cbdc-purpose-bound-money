import { WagmiRainbowKitProvider } from '@app/utils/wagmi-provider'
import { EmotionCacheProvider } from '@app/components/emotion-provider'
import { AppLayout } from '@app/components/app-layout'
import React from 'react'
import { PBMTokenProvider } from '@app/contexts/pbm-token-context'
import { AssetTokenProvider } from '@app/contexts/asset-token-context'
import { AccountAccessProvider } from '@app/contexts/account-access-context'
import { TransactionModalProvider } from '@app/components/transaction-modal'
import { AppProps, type AppType } from 'next/app'
import type { Session } from 'next-auth'

const App: AppType<{ session: Session | null }> = ({ Component, pageProps }: AppProps) => {
    return (
        <EmotionCacheProvider>
            <WagmiRainbowKitProvider>
                <PBMTokenProvider>
                    <AssetTokenProvider>
                        <AccountAccessProvider>
                            <AppLayout>
                                <TransactionModalProvider>
                                    <Component {...pageProps} />
                                </TransactionModalProvider>
                            </AppLayout>
                        </AccountAccessProvider>
                    </AssetTokenProvider>
                </PBMTokenProvider>
            </WagmiRainbowKitProvider>
        </EmotionCacheProvider>
    )
}

export default App
