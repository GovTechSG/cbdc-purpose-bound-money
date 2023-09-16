import React from 'react'
import { useNetwork } from 'wagmi'
import { Chain } from '@rainbow-me/rainbowkit'
import Link from 'next/link'

interface TransactionLinkProps extends Omit<React.ComponentProps<typeof Link>, 'href'> {
    hash: `0x${string}` | string
}

const TransactionLink: React.FC<TransactionLinkProps> = ({ hash, children, ...rest }) => {
    const { chain } = useNetwork()
    return (
        <Link href={`${getExplorerUrl(chain)}/tx/${hash}`} target="_blank" {...rest}>
            {children}
        </Link>
    )
}

interface AddressLinkProps extends Omit<React.ComponentProps<typeof Link>, 'href'> {
    address: `0x${string}` | string
}

const AddressLink: React.FC<AddressLinkProps> = ({ address, children, ...rest }) => {
    const { chain } = useNetwork()
    return (
        <Link href={`${getExplorerUrl(chain)}/address/${address}`} target="_blank" {...rest}>
            {children}
        </Link>
    )
}

const getExplorerUrl = (chain: Chain | undefined) => {
    const url = chain?.blockExplorers?.default.url
    return url ?? 'https://polygonscan.com'
}

export const BlockExplorer = {
    TransactionLink,
    AddressLink,
}
