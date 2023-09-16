import React from 'react'
import { useRouter } from 'next/router'
import { pageInfo } from '@app/common/config/page-info'
import { ConnectCard } from '@app/components/connect-card'
import { useAccount } from 'wagmi'
import { useConnectedHasAdministrativeRoles } from '@app/hooks/use-connected-has-administrative-roles'
import { useIsMounted } from '@app/hooks/use-is-mounted'
import { usePBMTokenContext } from '@app/contexts/pbm-token-context'
import { PageLoader } from '@app/components/page-loader'

export const withWalletConnected = (Component: React.FC) => {
    return function AuthenticatedComponent(props: React.ComponentProps<any>) {
        const router = useRouter()
        const { isConnected, isConnecting, isReconnecting } = useAccount()

        const isMounted = useIsMounted()
        const { loading: pbmTokenContextLoading } = usePBMTokenContext()
        const { hasAdministrativeRoles, loading: isAdminOrPayerLoading } =
            useConnectedHasAdministrativeRoles()

        const isPageAdminOnly =
            pageInfo.findIndex((page) => page.key === router.pathname && page.hidden) > -1

        if (
            !isMounted ||
            isAdminOrPayerLoading ||
            pbmTokenContextLoading ||
            isReconnecting ||
            isConnecting
        ) {
            return <PageLoader />
        }

        if (isConnected) {
            if (isPageAdminOnly && !hasAdministrativeRoles) {
                return <ConnectCard.Denied />
            }
            return <Component {...props} />
        }

        return <ConnectCard.Connect />
    }
}
