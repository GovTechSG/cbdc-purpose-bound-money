import React from 'react'
import { useNetwork } from 'wagmi'
import { resolveAddressName } from '@app/utils/address-book'
import { ellipsizeAddress } from '@app/utils/helpers'
import { getAddress } from 'ethers/lib/utils'

type AddressLabelPropsBase = {
    address: `0x${string}` | string
    truncateAddressIfLabel?: boolean
}

type IncludeAddressTrue = AddressLabelPropsBase & {
    includeAddress: true
    truncateAddress: boolean
    addressLength?: number
}

type IncludeAddressFalseOrUndefined = AddressLabelPropsBase & {
    includeAddress?: false
    truncateAddress?: never
    addressLength?: never
}

type AddressLabelProps = IncludeAddressTrue | IncludeAddressFalseOrUndefined

export const AddressBookLabel: React.FC<AddressLabelProps> = ({
    address,
    includeAddress,
    truncateAddress,
    addressLength,
    truncateAddressIfLabel,
}) => {
    const { chain } = useNetwork()

    const getLabel = () => {
        const safeAddress = getAddress(address)
        const displayAddress = ellipsizeAddress(safeAddress, addressLength ?? 10)

        const label = resolveAddressName(address, chain?.id)
        if (!label) {
            if (truncateAddressIfLabel) {
                return displayAddress
            }
            return safeAddress
        }

        if (includeAddress) {
            if (truncateAddress) {
                return `${label} (${displayAddress})`
            }
            return `${label} (${safeAddress})`
        }
    }

    return (
        <div>
            <span>{getLabel()}</span>
        </div>
    )
}
