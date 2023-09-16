import { formatUnits } from 'ethers/lib/utils'
import { PieChart, PieChartProps } from 'react-minimal-pie-chart'
import React, { useState } from 'react'
import { BigNumber } from 'ethers'
import styled from '@emotion/styled'
import { Tooltip } from 'react-tooltip'
import { formatNumberDisplay } from '@app/utils/helpers'

interface TokenAllocationChartProps {
    withdrawalBalance: BigNumber
    pbmDecimals: number
    pbmSymbol: string
    pbmBalance: BigNumber
    vPbmBalance: BigNumber
    colours: {
        ready: `#${string}`
        pending: `#${string}`
        holding: `#${string}`
    }
}

type BaseData = PieChartProps['data'][number]

const ChartContainer = styled.div`
    position: relative;

    & .title-label {
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: min(0.9vw, 0.95rem);
        line-height: min(0.9vw, 0.95rem);
        text-align: center;
        padding: 0.8rem;
        max-height: 8rem;
    }

    & #allocation-chart {
        position: relative;
        z-index: 999;
    }
`

const getChartData = ({
    withdrawalBalance,
    pbmDecimals,
    vPbmBalance,
    pbmSymbol,
    pbmBalance,
    colours,
}: TokenAllocationChartProps) => {
    const withdrawalBalanceValue = Number(formatUnits(withdrawalBalance, pbmDecimals))
    const lockedBalanceValue = Number(formatUnits(vPbmBalance, pbmDecimals))
    const walletBalanceValue = Number(formatUnits(pbmBalance, pbmDecimals))
    const emptyBalanceValue =
        !withdrawalBalanceValue && !lockedBalanceValue && !walletBalanceValue ? 1 : 0

    return [
        {
            title: 'Ready for Withdrawal',
            value: withdrawalBalanceValue,
            color: colours.ready,
            tooltip: `Ready for Withdrawal: ${formatNumberDisplay(
                withdrawalBalanceValue,
                4
            )} ${pbmSymbol}`,
        },
        {
            title: 'Pending Withdrawal',
            value: lockedBalanceValue,
            color: colours.pending,
            tooltip: `Pending Withdrawal: ${formatNumberDisplay(
                lockedBalanceValue,
                4
            )} ${pbmSymbol}`,
        },
        {
            title: 'Wallet Holding',
            value: walletBalanceValue,
            color: colours.holding,
            tooltip: `Wallet Holding: ${formatNumberDisplay(walletBalanceValue, 4)} ${pbmSymbol}`,
        },
        {
            title: 'Empty Balance',
            value: emptyBalanceValue,
            color: '#dedede',
            tooltip: `No token balances`,
        },
    ]
}

export const TokenAllocationChart: React.FC<TokenAllocationChartProps> = ({
    pbmDecimals,
    pbmSymbol,
    vPbmBalance,
    pbmBalance,
    withdrawalBalance,
    colours,
}) => {
    const [hovered, setHovered] = useState<number | null>(null)

    const data = getChartData({
        pbmDecimals,
        vPbmBalance,
        withdrawalBalance,
        pbmSymbol,
        pbmBalance,
        colours,
    })

    return (
        <ChartContainer>
            <div className="title-label">
                Your {pbmSymbol.toUpperCase()}
                <br />
                Allocations
            </div>
            <div id="allocation-chart" data-tooltip-id="chart">
                <PieChart
                    data={data}
                    lineWidth={15}
                    style={{ maxHeight: '8rem' }}
                    rounded
                    onMouseOver={(_, index) => {
                        setHovered(index)
                    }}
                    onMouseOut={() => {
                        setHovered(null)
                    }}
                />
                <Tooltip
                    id="chart"
                    render={() =>
                        typeof hovered === 'number' ? makeTooltipContent(data[hovered]) : null
                    }
                />
            </div>
        </ChartContainer>
    )
}

function makeTooltipContent(
    entry: BaseData & {
        tooltip: BaseData['title']
    }
) {
    return entry.tooltip
}
