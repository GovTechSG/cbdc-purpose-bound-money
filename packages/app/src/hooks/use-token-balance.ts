import { useCallback, useEffect, useState } from 'react'
import { BigNumber, ethers } from 'ethers'
import { IERC20Metadata, IERC20Metadata__factory } from '@pbm/contracts'
import { useAccount, useNetwork, useProvider } from 'wagmi'

type UseTokenBalanceParams = {
    token?: string
    account?: string
    onBalanceChange?: (data: Omit<UseTokenBalanceReturnType, 'loading'>) => void | Promise<void>
}

type UseTokenBalanceReturnType = {
    balance: BigNumber
    decimals: number
    decimalBalance: string | undefined
    symbol: string | undefined
    loading: boolean
}

export const useTokenBalance = (props?: UseTokenBalanceParams): UseTokenBalanceReturnType => {
    const { token, account, onBalanceChange } = props || {}

    const [balance, setBalance] = useState<BigNumber>(BigNumber.from(0))
    const [decimals, setDecimals] = useState<number>(0)
    const [decimalBalance, setDecimalBalance] = useState<string>()
    const [symbol, setSymbol] = useState<string>()
    const [loading, setLoading] = useState<boolean>(false)

    const provider = useProvider()
    const { address: connectedAddress, isConnected } = useAccount()
    const { chain } = useNetwork()

    const updateState = useCallback(
        (newBalance: BigNumber, decimals: number, symbol?: string) => {
            const decimalBalance = ethers.utils.formatUnits(newBalance, decimals)
            setBalance(newBalance)
            setDecimals(decimals)
            setDecimalBalance(decimalBalance)
            symbol && setSymbol(symbol)
            onBalanceChange &&
                onBalanceChange({ balance: newBalance, decimals, decimalBalance, symbol })
        },
        [onBalanceChange]
    )

    useEffect(() => {
        let tokenContract: IERC20Metadata
        const fetchBalance = async () => {
            if (!token || chain?.unsupported || !isConnected) return

            const code = await provider.getCode(token)
            if (code === '0x' || !code) return

            tokenContract = IERC20Metadata__factory.connect(token, provider)
            const targetAccount = account || connectedAddress
            if (!targetAccount) {
                return updateState(BigNumber.from(0), 0)
            }

            try {
                setLoading(true)
                const [initialBalance, decimals, symbol] = await Promise.all([
                    tokenContract.balanceOf(targetAccount),
                    tokenContract.decimals(),
                    tokenContract.symbol(),
                ])
                updateState(initialBalance, decimals, symbol)

                tokenContract.on('Transfer', async (from, to) => {
                    if (from === targetAccount || to === targetAccount) {
                        setLoading(true)
                        const balance = await tokenContract.balanceOf(targetAccount)
                        updateState(balance, decimals)
                        setLoading(false)
                    }
                })
            } catch (e) {
                console.warn('useTokenBalance fetchBalance error', e)
                updateState(BigNumber.from(0), 0, undefined)
            } finally {
                setLoading(false)
            }
        }

        fetchBalance()

        return () => {
            tokenContract?.removeAllListeners()
        }
    }, [account, chain?.unsupported, connectedAddress, isConnected, provider, token, updateState])

    return { balance, decimals, decimalBalance, loading, symbol }
}
