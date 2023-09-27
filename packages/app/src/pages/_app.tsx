import { AppLayout } from '@app/components/app-layout'
import { EmotionCacheProvider } from '@app/components/emotion-provider'
import { TransactionModalProvider } from '@app/components/transaction-modal'
import { AccountAccessProvider } from '@app/contexts/account-access-context'
import { AssetTokenProvider } from '@app/contexts/asset-token-context'
import { PBMTokenProvider } from '@app/contexts/pbm-token-context'
import { WagmiRainbowKitProvider } from '@app/utils/wagmi-provider'
import type { Session } from 'next-auth'
import { AppProps, type AppType } from 'next/app'
import Script from 'next/script'
import React from 'react'

const App: AppType<{ session: Session | null }> = ({ Component, pageProps }: AppProps) => {
    const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

    return (
        <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`} />
            <Script id="google-analytics">
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
         
                  gtag('config', '${gaMeasurementId}');
                `}
            </Script>

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
        </>
    )
}

export default App
