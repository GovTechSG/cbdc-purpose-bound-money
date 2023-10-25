import { useMemo } from 'react'
import { useNetwork, useProvider, useWebSocketProvider } from 'wagmi'

export const useSafeProvider = () => {
    const { chain } = useNetwork()
    const wsProvider = useWebSocketProvider()
    const httpProvider = useProvider()

    return useMemo(() => wsProvider ?? httpProvider, [chain?.id, wsProvider, httpProvider])
}
