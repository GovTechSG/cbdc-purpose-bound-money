'use client'

import { usePBMTokenContext } from '@app/contexts/pbm-token-context'
import { ERC20MetadataContextProps } from '@app/contexts/types'
import { IERC20Metadata } from '@pbm/contracts'
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

type AssetTokenContextProps = {
    contract: IERC20Metadata | undefined
} & ERC20MetadataContextProps

const AssetTokenContext = createContext<AssetTokenContextProps>({
    address: undefined,
    contract: undefined,
    name: '',
    decimals: 0,
    symbol: '',
})

export const AssetTokenProvider = ({ children }: { children: React.ReactNode }) => {
    const { assetContract } = usePBMTokenContext()
    // const provider = useProvider()

    const [contract, setContract] = useState<IERC20Metadata>()
    const [decimals, setDecimals] = useState<number>(0)
    const [symbol, setSymbol] = useState<string>('')
    const [name, setName] = useState<string>('')
    const value = useMemo(
        () => ({ address: assetContract?.address, decimals, symbol, name, contract }),
        [assetContract, decimals, symbol, name, contract]
    )

    useEffect(() => {
        const fetchTokenData = async () => {
            if (!assetContract) return
            // const tokenContract = IERC20Metadata__factory.connect(address, provider)
            const [tokenDecimals, tokenSymbol, tokenName] = await Promise.all([
                assetContract.decimals(),
                assetContract.symbol(),
                assetContract.name(),
            ])
            setContract(assetContract)
            setDecimals(tokenDecimals)
            setSymbol(tokenSymbol)
            setName(tokenName)
        }
        fetchTokenData()
    }, [assetContract])

    return <AssetTokenContext.Provider value={value}>{children}</AssetTokenContext.Provider>
}

export const useAssetTokenContext = () => useContext(AssetTokenContext)
