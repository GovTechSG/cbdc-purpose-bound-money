'use client'

import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { usePBMTokenContext } from '@app/contexts/pbm-token-context'
import { useAccount } from 'wagmi'
import { ethers } from 'ethers'
import { roles } from '@app/common/constants'

const { ADMIN_ROLE, PAYEE_ROLE, PAYER_ROLE, TREASURER_ROLE } = roles

type AccountAccessContextProps = {
    connectedAccount: string | undefined
    isConnectedAdmin: boolean
    isConnectedTreasurer: boolean
    isConnectedPayer: boolean
    isConnectedPayee: boolean
    connectedAccountRoles: string[]
    loading: boolean
    isAdmin: (account: string) => Promise<boolean>
    isTreasurer: (account: string) => Promise<boolean>
    isPayer: (account: string) => Promise<boolean>
    isPayee: (account: string) => Promise<boolean>
}

const AccountAccessContext = createContext<AccountAccessContextProps>({
    connectedAccount: undefined,
    isConnectedAdmin: false,
    isConnectedTreasurer: false,
    isConnectedPayer: false,
    isConnectedPayee: false,
    connectedAccountRoles: [],
    loading: false,
    isAdmin: () => Promise.reject(),
    isTreasurer: () => Promise.reject(),
    isPayer: () => Promise.reject(),
    isPayee: () => Promise.reject(),
})

const getValueFromRoleSettledResult = (result: PromiseSettledResult<boolean>) => {
    if (result.status === 'rejected') return false
    return result.value
}

export const AccountAccessProvider = ({ children }: { children: React.ReactNode }) => {
    const { contract: pbmContract } = usePBMTokenContext()
    const { address: accountAddress, isConnected } = useAccount()

    const [connectedAccountRoles, setConnectedAccountRoles] = useState<string[]>([])
    const [isConnectedAdmin, setIsConnectedAdmin] = useState<boolean>(false)
    const [isConnectedTreasurer, setIsConnectedTreasurer] = useState<boolean>(false)
    const [isConnectedPayer, setIsConnectedPayer] = useState<boolean>(false)
    const [isConnectedPayee, setIsConnectedPayee] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    const hasRole = useCallback(
        async (account: string, role: string) => {
            if (!pbmContract) return false
            return pbmContract.hasRole(role, account)
        },
        [pbmContract]
    )

    const value = useMemo<AccountAccessContextProps>(
        () => ({
            connectedAccount: isConnected ? accountAddress : undefined,
            isConnectedAdmin,
            isConnectedTreasurer,
            isConnectedPayer,
            isConnectedPayee,
            connectedAccountRoles,
            loading,
            isAdmin: (account: string) => hasRole(account, ADMIN_ROLE),
            isTreasurer: (account: string) => hasRole(account, TREASURER_ROLE),
            isPayer: (account: string) => hasRole(account, PAYER_ROLE),
            isPayee: (account: string) => hasRole(account, PAYEE_ROLE),
        }),
        [
            accountAddress,
            connectedAccountRoles,
            hasRole,
            loading,
            isConnected,
            isConnectedAdmin,
            isConnectedTreasurer,
            isConnectedPayer,
            isConnectedPayee,
        ]
    )

    useEffect(() => {
        ;(async () => {
            if (!isConnected || !accountAddress) return
            setLoading(true)
            const [isAdmin, isTreasurer, isPayer, isPayee] = await Promise.allSettled([
                hasRole(accountAddress, ADMIN_ROLE),
                hasRole(accountAddress, TREASURER_ROLE),
                hasRole(accountAddress, PAYER_ROLE),
                hasRole(accountAddress, PAYEE_ROLE),
            ])
            setIsConnectedAdmin(getValueFromRoleSettledResult(isAdmin))
            setIsConnectedTreasurer(getValueFromRoleSettledResult(isTreasurer))
            setIsConnectedPayer(getValueFromRoleSettledResult(isPayer))
            setIsConnectedPayee(getValueFromRoleSettledResult(isPayee))

            const accountRoles = []
            if (isAdmin) accountRoles.push(ethers.constants.Zero.toHexString())
            if (isTreasurer) accountRoles.push(ethers.utils.id('TREASURER_ROLE'))
            if (isPayer) accountRoles.push(ethers.utils.id('PAYER_ROLE'))
            if (isPayee) accountRoles.push(ethers.utils.id('PAYEE_ROLE'))
            setConnectedAccountRoles(accountRoles)
            setLoading(false)
        })()
    }, [accountAddress, hasRole, isConnected])

    return <AccountAccessContext.Provider value={value}>{children}</AccountAccessContext.Provider>
}

export const useAccountAccessContext = () => React.useContext(AccountAccessContext)
