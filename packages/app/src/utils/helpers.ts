import { BigNumber, ethers } from 'ethers'
import { Chain } from '@rainbow-me/rainbowkit'
import { hardhat, polygon, polygonMumbai } from 'wagmi/chains'
import ellipsize from 'ellipsize'

export const formatHex = (value: string, addPrefix: boolean = false) => {
    if (value === undefined || value.length <= 2) return value || ''
    const prefix = value.substring(0, 2)
    if (addPrefix) {
        return prefix === '0x' ? value : `0x${value}`
    } else {
        return prefix === '0x' ? value.substring(2) : value
    }
}

export const convertEthersError = (e: any) => {
    let error = e as Error
    if ((e as any).error) error = (e as any).error
    return error
}

export const formatNumberDisplay = (
    value: number | bigint | string | undefined,
    maxDecimals: number = 2,
    minDecimals: number = 2
) => {
    if (value === undefined) return '0'
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: minDecimals,
        maximumFractionDigits: maxDecimals === 0 ? 2 : maxDecimals,
    }).format(value as bigint)
}

export const parseAmount = (amount: number | string, decimals: number = 18) => {
    return ethers.utils.parseUnits(amount.toString(), decimals)
}

export const parseWei = (wei: BigNumber, decimals: number = 18) => {
    return ethers.utils.formatUnits(wei, decimals)
}

export const ellipsizeAddress = (address: string, length: number = 10) => {
    return `0x${ellipsize(formatHex(address as string), length, {
        // @ts-ignore
        truncate: 'middle',
    })}`
}

export const getDefaultChains = () => {
    let defaultChains: Chain[] = []

    const enableTestnets = process.env.NEXT_PUBLIC_ENABLE_TESTNETS === '1'
    const enableHardhatNode = process.env.NEXT_PUBLIC_ENABLE_HARDHAT_NODE === '1'

    if (enableHardhatNode) {
        defaultChains.push(hardhat)
    }

    if (enableTestnets) {
        defaultChains.push(polygonMumbai)
    }

    if (!enableHardhatNode && !enableTestnets) {
        defaultChains.push(polygon)
    }

    return defaultChains
}

export const raise = (err: string): never => {
    throw new Error(err)
}
