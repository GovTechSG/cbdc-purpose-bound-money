import { ChainId } from '@app/common/enums'
import { addressBookLocal, addressBookMumbai, addressBookPolygon } from '@app/common/config';

export type AddressBookData = {
    [address: `0x${string}` | string]: string
}

type AddressBookChainData = {
    [chainId in ChainId]?: AddressBookData
}

const data: AddressBookChainData = {
    [ChainId.Polygon]: addressBookPolygon,
    [ChainId.Mumbai]: addressBookMumbai,
    [ChainId.Local]: addressBookLocal,
    [ChainId.LocalHardhat]: addressBookLocal,
}

export const resolveAddressName = (
    address: string,
    chainId: ChainId | number | undefined
): string | undefined => {
    if (!chainId) return undefined
    return data[chainId as ChainId]?.[address]
}
