import { InfoCircleTwoTone } from '@ant-design/icons'
import { AddressBookLabelWithTooltip } from '@app/components/address-book-label-with-tooltip'
import { StatisticTitleWithLoader } from '@app/components/token-overview/pbm-overview-card/statistic-title-with-loader'
import { useTransactionModal } from '@app/contexts/transaction-modal-context'
import { formatNumberDisplay, isAutomationEnabled } from '@app/utils/helpers'
import { PBM } from '@pbm/contracts'
import { Button, Space, Tooltip, Typography } from 'antd'
import { BigNumber, Signer } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import React from 'react'
import { useSigner } from 'wagmi'

interface WithdrawalBalanceStatisticProps {
    withdrawalBalance: BigNumber
    withdrawableDepositIds: BigNumber[]
    loading: boolean
    legendColour: `#${string}`
    pbmContract: PBM | undefined
    pbmDecimals: number
    pbmSymbol: string
}

export const WithdrawalBalanceStatistic: React.FC<WithdrawalBalanceStatisticProps> = ({
    withdrawalBalance,
    withdrawableDepositIds,
    loading: withdrawalBalanceLoading,
    pbmContract,
    pbmDecimals,
    pbmSymbol,
    legendColour,
}) => {
    const { data: signer } = useSigner()

    const { open } = useTransactionModal()

    const pbmWithdrawalHandler = async (
        targetDepositIds: BigNumber[],
        withdrawalBalance: BigNumber
    ) => {
        if (!pbmContract || !signer || !targetDepositIds.length) return
        const action = async () => {
            const signerAddress = await (signer as Signer).getAddress()
            return pbmContract.connect(signer as Signer).withdraw(signerAddress, targetDepositIds)
        }
        const modalDetails = await formatModalDetails({
            signer: signer as Signer,
            pbmAddress: pbmContract.address,
            decimals: pbmDecimals,
            targetDepositIds,
            withdrawalBalance,
            pbmSymbol,
        })
        open(action, modalDetails)
    }

    const title = `Ready for Withdrawal (${pbmSymbol})`

    return (
        <Space direction="vertical">
            <StatisticTitleWithLoader
                title={title}
                legendColour={legendColour}
                loading={withdrawalBalanceLoading}
                value={formatNumberDisplay(
                    formatUnits(withdrawalBalance, pbmDecimals),
                    pbmDecimals
                )}
            />
            <Button
                type="primary"
                shape="round"
                size="large"
                disabled={
                    withdrawalBalance.lte(0) ||
                    !withdrawableDepositIds.length ||
                    withdrawalBalanceLoading
                }
                onClick={() => pbmWithdrawalHandler(withdrawableDepositIds, withdrawalBalance)}
            >
                Withdraw All
            </Button>
            {isAutomationEnabled() && (
                <Space>
                    <Tooltip
                        title={`When Automatic Withdrawal is enabled, your pending ${pbmSymbol} will be withdrawn and transferred into your wallet as soon as they mature. You can still withdraw manually should the automation be disabled or delayed.`}
                        placement="bottom"
                    >
                        <InfoCircleTwoTone style={{ display: 'flex' }} />
                    </Tooltip>
                    <Typography.Text type="secondary" style={{ fontSize: 'smaller' }}>
                        Automatic Withdrawal is enabled
                    </Typography.Text>
                </Space>
            )}
        </Space>
    )
}

const formatModalDetails = async ({
    signer,
    decimals,
    pbmAddress,
    targetDepositIds,
    withdrawalBalance,
    pbmSymbol,
}: {
    signer: Signer
    decimals: number
    pbmAddress: string
    targetDepositIds: BigNumber[]
    withdrawalBalance: BigNumber
    pbmSymbol: string
}) => {
    const signerAddress = await signer.getAddress()

    return {
        Action: 'Withdraw All PBM',
        'PBM Address': <AddressBookLabelWithTooltip address={pbmAddress} />,
        'From/To Address': <AddressBookLabelWithTooltip address={signerAddress} />,
        'Target Deposit IDs': targetDepositIds.map((id) => id.toString()).join(', '),
        'Estimated Amount': `${formatNumberDisplay(
            formatUnits(withdrawalBalance, decimals),
            decimals
        )} ${pbmSymbol.toUpperCase()}`,
    }
}
