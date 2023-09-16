import { useAccountAccessContext } from '@app/contexts/account-access-context'
import { useAccount } from 'wagmi'

export const useConnectedHasAdministrativeRoles = () => {
    const { isConnected } = useAccount()
    const { isConnectedPayer, isConnectedAdmin, isConnectedTreasurer, loading } =
        useAccountAccessContext()

    const hasAdministrativeRoles =
        isConnected && (isConnectedPayer || isConnectedAdmin || isConnectedTreasurer)

    return { hasAdministrativeRoles, loading }
}
