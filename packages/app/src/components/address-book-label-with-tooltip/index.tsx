import { AddressBookLabel } from '@app/components/address-book-label'
import { AddressTooltip } from '@app/components/address-tooltip'
import React from 'react'

interface AddressBookLabelWithTooltipProps {
    address: `0x${string}` | string
}

type AddressBookLabelWithTooltipType = AddressBookLabelWithTooltipProps &
    React.ComponentProps<typeof AddressBookLabel>

export const AddressBookLabelWithTooltip: React.FC<AddressBookLabelWithTooltipType> = ({
    address,
    ...rest
}) => {
    return (
        <AddressTooltip address={address!}>
            {/* @ts-ignore */}
            <AddressBookLabel
                address={address!}
                truncateAddress={true}
                includeAddress={true}
                truncateAddressIfLabel={true}
                {...rest}
            />
        </AddressTooltip>
    )
}
