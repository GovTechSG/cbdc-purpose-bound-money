import { chainInfoLocal, chainInfoMumbai, chainInfoPolygon } from '@app/common/config'
import { resolveAddressName } from '@app/utils/address-book'

export type AppChainInfo = {
    pbm: PbmChainInfo
    payees: (`0x${string}` | string)[]
}

type PayeeChainInfo = {
    name: string
    address: `0x${string}` | string
}

type PbmChainInfo = {
    address: `0x${string}` | string
    genesisBlock: number
}

export const getAppChainInfo = (chainId: number | undefined): AppChainInfo | null => {
    if (!chainId) return null
    switch (chainId) {
        case 137:
            return chainInfoPolygon
        case 80001:
            return chainInfoMumbai
        case 1337:
        case 31337:
            return chainInfoLocal
        default:
            return null
    }
}

export const getPayees = (chainId: number | undefined): PayeeChainInfo[] => {
    const chainInfo = getAppChainInfo(chainId)
    if (!chainInfo) return []
    return chainInfo.payees.map((payee) => ({
        name: resolveAddressName(payee, chainId) ?? 'Unknown Payee Address',
        address: payee,
    }))
}
