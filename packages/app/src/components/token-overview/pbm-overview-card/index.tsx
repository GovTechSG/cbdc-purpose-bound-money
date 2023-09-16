import React from 'react'
import { Col, Row, Space } from 'antd'
import { useTokenBalance } from '@app/hooks/use-token-balance'
import { useGetWithdrawalBalance } from '@app/hooks/use-get-withdrawal-balance'
import { usePBMTokenContext } from '@app/contexts/pbm-token-context'
import { BigNumber } from 'ethers'
import { WithdrawalBalanceStatistic } from '@app/components/token-overview/pbm-overview-card/withdrawal-balance-statistic'
import { LockedBalanceStatistic } from '@app/components/token-overview/pbm-overview-card/locked-balance-statistic'
import { useIsMounted } from '@app/hooks/use-is-mounted'
import { TokenAllocationChart } from '@app/components/token-overview/pbm-overview-card/token-allocation-chart'
import { DashboardCard } from '@app/components/token-overview/dashboard-card'
import { AllocationLegendIndicator } from '@app/components/token-overview/pbm-overview-card/allocation-legend-indicator'
import { SkeletonLoader } from '@app/components/skeleton-loader'
import { AddressTooltip } from '@app/components/address-tooltip'
import { AddressBookLabel } from '@app/components/address-book-label'

interface WithdrawalStatisticProps {
    connectedAddress: string | `0x${string}` | undefined
    pbmBalance: BigNumber
}

const legendColours: React.ComponentProps<typeof TokenAllocationChart>['colours'] = {
    ready: '#FFC154',
    pending: '#EE7A67',
    holding: '#47B39C',
}

const CardTitle: React.FC<{ connectedAddress: string | undefined }> = ({ connectedAddress }) => {
    const isMounted = useIsMounted()
    const loading = !isMounted || !connectedAddress
    const displayAddress = (
        <SkeletonLoader.Input loading={loading}>
            <AddressTooltip address={connectedAddress!}>
                <AddressBookLabel
                    address={connectedAddress!}
                    truncateAddress={true}
                    includeAddress={true}
                    truncateAddressIfLabel={true}
                    addressLength={10}
                />
            </AddressTooltip>
        </SkeletonLoader.Input>
    )

    return (
        <div style={{ display: 'flex' }}>
            <span style={{ paddingRight: '0.3rem' }}>PBM Overview for</span>
            {displayAddress}
        </div>
    )
}

export const PbmOverviewCard: React.FC<WithdrawalStatisticProps> = ({
    connectedAddress,
    pbmBalance,
}) => {
    const {
        decimals: pbmDecimals,
        contract: pbmContract,
        symbol: pbmSymbol,
        vaultContract: pbmVaultContract,
    } = usePBMTokenContext()

    const {
        withdrawalBalance,
        loading: withdrawalBalanceLoading,
        withdrawableDepositIds,
    } = useGetWithdrawalBalance(connectedAddress)

    const {
        decimalBalance: vPbmDecimalBalance,
        loading: vPbmLoading,
        balance: vPbmBalance,
    } = useTokenBalance({
        account: connectedAddress,
        token: pbmVaultContract?.address,
    })

    return (
        <DashboardCard title={<CardTitle connectedAddress={connectedAddress} />}>
            <Row gutter={16}>
                <Col span={5}>
                    <Space direction="vertical" align="center">
                        <TokenAllocationChart
                            withdrawalBalance={withdrawalBalance}
                            pbmDecimals={pbmDecimals}
                            vPbmBalance={vPbmBalance}
                            pbmSymbol={pbmSymbol}
                            pbmBalance={pbmBalance}
                            colours={legendColours}
                        />
                        <AllocationLegendIndicator
                            colour={legendColours.holding}
                            title="Wallet Holding"
                        />
                    </Space>
                </Col>
                <Col span={9} offset={1}>
                    <WithdrawalBalanceStatistic
                        withdrawalBalance={withdrawalBalance}
                        withdrawableDepositIds={withdrawableDepositIds}
                        loading={withdrawalBalanceLoading}
                        legendColour={legendColours.ready}
                        pbmContract={pbmContract}
                        pbmDecimals={pbmDecimals}
                        pbmSymbol={pbmSymbol}
                    />
                </Col>
                <Col span={9}>
                    <LockedBalanceStatistic
                        lockedDecimalBalance={vPbmDecimalBalance}
                        loading={vPbmLoading}
                        pbmSymbol={pbmSymbol}
                        legendColour={legendColours.pending}
                    />
                </Col>
            </Row>
        </DashboardCard>
    )
}
