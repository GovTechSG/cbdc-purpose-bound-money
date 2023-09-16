'use client'

import createCache from '@emotion/cache'
import { CacheProvider, css, Global } from '@emotion/react'

const emotionCache = createCache({ key: 'css' })

const globalStyles = css`
    body {
        margin: 0;
        padding: 0;
        font-family: sans-serif;
    }
`

export const EmotionCacheProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <CacheProvider value={emotionCache}>
            <Global styles={globalStyles} />
            {children}
        </CacheProvider>
    )
}
