import { Button, Space } from 'antd'
import { formatNumberDisplay } from '@app/utils/helpers'
import { formatUnits } from 'ethers/lib/utils'
import React from 'react'
import { BigNumber, Signer } from 'ethers'
import { useTransactionModal } from '@app/contexts/transaction-modal-context'
import { useSigner } from 'wagmi'
import { PBM } from '@pbm/contracts'
import { StatisticTitleWithLoader } from '@app/components/token-overview/pbm-overview-card/statistic-title-with-loader'

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
        'PBM Address': pbmAddress,
        'From/To Address': signerAddress,
        'Target Deposit IDs': targetDepositIds.map((id) => id.toString()).join(', '),
        'Estimated Amount': `${formatNumberDisplay(
            formatUnits(withdrawalBalance, decimals),
            decimals
        )} ${pbmSymbol.toUpperCase()}`,
    }
}
