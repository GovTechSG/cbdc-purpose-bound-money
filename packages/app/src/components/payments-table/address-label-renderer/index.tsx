import { AddressTooltip } from '@app/components/address-tooltip'
import { AddressBookLabel } from '@app/components/address-book-label'
import React from 'react'

export const addressLabelRenderer = (address: `0x${string}`) => {
    return (
        <AddressTooltip address={address}>
            <AddressBookLabel address={address} truncateAddress={true} includeAddress={true} />
        </AddressTooltip>
    )
}
