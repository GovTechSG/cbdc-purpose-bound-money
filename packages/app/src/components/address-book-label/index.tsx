import { useWindowSize } from '@app/hooks/use-window-size'
import { resolveAddressName } from '@app/utils/address-book'
import { ellipsizeAddress } from '@app/utils/helpers'
import { getAddress } from 'ethers/lib/utils'
import React from 'react'
import { useNetwork } from 'wagmi'

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
    const { width } = useWindowSize()

    const getLabel = () => {
        const safeAddress = getAddress(address)
        const displayAddress = ellipsizeAddress(
            safeAddress,
            addressLength ?? getResponsiveTruncateLength(width)
        )

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

const getResponsiveTruncateLength = (width: number) => {
    let length = 10
    if (width > 2800) {
        // Full address
        length = 40
    } else if (width > 2200) {
        length = 20
    } else if (width > 1880) {
        length = 18
    } else if (width > 1700) {
        length = 14
    } else if (width > 1500) {
        length = 12
    }
    return length
}
