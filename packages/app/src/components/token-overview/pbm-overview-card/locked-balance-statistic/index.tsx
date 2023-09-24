import { StatisticTitleWithLoader } from '@app/components/token-overview/pbm-overview-card/statistic-title-with-loader'
import React from 'react'

interface TokenBalanceStatisticProps {
    title: string
    decimalBalance: string | number | undefined
    loading: boolean
    pbmSymbol: string
    legendColour: `#${string}`
}

export const TokenBalanceStatistic: React.FC<TokenBalanceStatisticProps> = ({
    title,
    decimalBalance,
    loading,
    pbmSymbol,
    legendColour,
}) => {
    const titleWithSymbol = `${title} (${pbmSymbol})`

    return (
        <StatisticTitleWithLoader
            title={titleWithSymbol}
            legendColour={legendColour}
            loading={loading}
            value={decimalBalance}
        />
    )
}
