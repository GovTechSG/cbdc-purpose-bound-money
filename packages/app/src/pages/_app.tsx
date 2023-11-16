import { AppLayout } from '@app/components/app-layout'
import { EmotionCacheProvider } from '@app/components/emotion-provider'
import { TransactionModalProvider } from '@app/components/transaction-modal'
import { AccountAccessProvider } from '@app/contexts/account-access-context'
import { AssetTokenProvider } from '@app/contexts/asset-token-context'
import { PBMTokenProvider } from '@app/contexts/pbm-token-context'
import { WagmiRainbowKitProvider } from '@app/utils/wagmi-provider'
import type { Session } from 'next-auth'
import { AppProps, type AppType } from 'next/app'
import Head from 'next/head'
import Script from 'next/script'
import React from 'react'

const App: AppType<{ session: Session | null }> = ({ Component, pageProps }: AppProps) => {
    const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

    return (
        <>
            <Head>
                <title>Purpose Bound Money (PBM) Portal</title>
                <meta property="og:image:type" content="website" />
                <meta property="og:image" content="/opengraph-image.png" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:image:alt" content="Purpose Bound Money (PBM) Portal" />
                <meta property="og:title" content="Purpose Bound Money (PBM) Portal" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta
                    property="og:description"
                    content="A protocol, developed as part of Project Orchid, enabling the use of digital money with automated on-chain escrow payment releases."
                />
            </Head>

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
