'use client'

import { ERC20MetadataContextProps } from '@app/contexts/types'
import { getAppChainInfo } from '@app/utils/get-app-chain-info'
import {
    IERC20Metadata,
    IERC20Metadata__factory,
    PBM,
    PBM__factory,
    PBMVault,
    PBMVault__factory,
} from '@pbm/contracts'
import { BigNumber } from 'ethers'
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useAccount, useNetwork, useProvider } from 'wagmi'

type PBMTokenContextProps = {
    asset: string | undefined
    assetContract: IERC20Metadata | undefined
    assetAllowance: BigNumber | undefined
    reload: () => Promise<void>
    contract: PBM | undefined
    vaultContract: PBMVault | undefined
    genesisBlock: number
    loading: boolean
} & ERC20MetadataContextProps

const PBMTokenContext = createContext<PBMTokenContextProps>({
    address: undefined,
    name: '',
    decimals: 0,
    symbol: '',
    asset: undefined,
    assetContract: undefined,
    assetAllowance: undefined,
    reload: async () => {},
    contract: undefined,
    vaultContract: undefined,
    genesisBlock: 0,
    loading: false,
})

export const PBMTokenProvider = ({ children }: { children: React.ReactNode }) => {
    const { chain } = useNetwork()
    const [address, setAddress] = useState<string | undefined>()
    const [genesisBlock, setGenesisBlock] = useState<number>(0)

    const [contract, setContract] = useState<PBM>()
    const [vaultContract, setVaultContract] = useState<PBMVault>()
    const [assetContract, setAssetContract] = useState<IERC20Metadata>()
    const [decimals, setDecimals] = useState<number>(0)
    const [symbol, setSymbol] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [asset, setAsset] = useState<string | undefined>()
    const [assetAllowance, setAssetAllowance] = useState<BigNumber>()
    const [loading, setLoading] = useState<boolean>(false)
    const value = useMemo(
        () => ({
            contract,
            vaultContract,
            address,
            decimals,
            symbol,
            name,
            asset,
            assetContract,
            assetAllowance,
            loading,
            genesisBlock,
        }),
        [
            contract,
            vaultContract,
            address,
            decimals,
            symbol,
            name,
            asset,
            assetContract,
            assetAllowance,
            loading,
            genesisBlock,
        ]
    )
    const provider = useProvider()
    const { address: connectedAccount } = useAccount()

    useEffect(() => {
        const pbmInfo = getAppChainInfo(chain?.id)?.pbm
        if (!pbmInfo) {
            setAddress(undefined)
            setAsset(undefined)
            setContract(undefined)
            setGenesisBlock(0)
            return
        }
        const tokenContract = PBM__factory.connect(pbmInfo.address, provider)
        setContract(tokenContract)
        setGenesisBlock(pbmInfo.genesisBlock)
    }, [chain?.id, provider])

    const fetchAssetAllowance = useCallback(async () => {
        const tokenContract = contract
        if (!connectedAccount || !tokenContract) return
        const asset = await tokenContract.asset()
        const assetContract = IERC20Metadata__factory.connect(asset, tokenContract.provider)
        return assetContract.allowance(connectedAccount, tokenContract.address)
    }, [contract, connectedAccount])

    const fetchTokenData = useCallback(async () => {
        const tokenContract = contract
        if (!tokenContract) return

        const code = await tokenContract.provider.getCode(tokenContract.address)
        if (code === '0x' || !code) return

        try {
            setLoading(true)
            const [tokenDecimals, tokenSymbol, tokenName, asset, assetAllowance, vaultAddress] =
                await Promise.all([
                    tokenContract.decimals(),
                    tokenContract.symbol(),
                    tokenContract.name(),
                    tokenContract.asset(),
                    fetchAssetAllowance(),
                    tokenContract.vault(),
                ])
            setAddress(tokenContract.address)
            setContract(tokenContract)
            setDecimals(tokenDecimals)
            setSymbol(tokenSymbol)
            setName(tokenName)
            setAsset(asset)
            setAssetAllowance(assetAllowance)
            setAssetContract(IERC20Metadata__factory.connect(asset, tokenContract.provider))
            setVaultContract(PBMVault__factory.connect(vaultAddress, tokenContract.provider))
        } catch (e) {
            console.warn('PBMTokenProvider fetchTokenData error', e)
            setAddress(undefined)
            setContract(undefined)
            setDecimals(0)
            setSymbol('')
            setName('')
            setAsset(undefined)
            setAssetAllowance(undefined)
            setAssetContract(undefined)
            setVaultContract(undefined)
        } finally {
            setLoading(false)
        }
    }, [fetchAssetAllowance, contract])

    useEffect(() => {
        fetchTokenData()

        return () => {
            contract?.removeAllListeners()
        }
    }, [contract, fetchTokenData])

    return (
        <PBMTokenContext.Provider value={{ ...value, reload: fetchTokenData }}>
            {children}
        </PBMTokenContext.Provider>
    )
}

export const usePBMTokenContext = () => useContext(PBMTokenContext)
