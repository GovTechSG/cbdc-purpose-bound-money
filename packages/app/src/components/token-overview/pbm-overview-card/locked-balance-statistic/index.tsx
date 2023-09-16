import React from 'react'
import { StatisticTitleWithLoader } from '@app/components/token-overview/pbm-overview-card/statistic-title-with-loader'

interface LockedBalanceStatisticProps {
    lockedDecimalBalance: string | undefined
    loading: boolean
    pbmSymbol: string
    legendColour: `#${string}`
}

export const LockedBalanceStatistic: React.FC<LockedBalanceStatisticProps> = ({
    lockedDecimalBalance,
    loading,
    pbmSymbol,
    legendColour,
}) => {
    const title = `Pending Withdrawal (${pbmSymbol})`

    return (
        <StatisticTitleWithLoader
            title={title}
            legendColour={legendColour}
            loading={loading}
            value={lockedDecimalBalance}
        />
    )
}
