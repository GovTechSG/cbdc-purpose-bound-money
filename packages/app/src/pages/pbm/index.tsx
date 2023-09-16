import { Col, Row } from 'antd'
import { useAppLayoutContext } from '@app/components/app-layout'
import { PbmOverviewCard } from '@app/components/token-overview/pbm-overview-card'
import { useAccount, useProvider, useSigner } from 'wagmi'
import { usePBMTokenContext } from '@app/contexts/pbm-token-context'
import { useTokenBalance } from '@app/hooks/use-token-balance'
import { PbmUnwrapCard } from '@app/components/token-overview/pbm-unwrap-card'
import { useTransactionModal } from '@app/contexts/transaction-modal-context'
import { BigNumber, ethers, Signer } from 'ethers'
import { formatNumberDisplay } from '@app/utils/helpers'
import { formatUnits } from 'ethers/lib/utils'
import React, { ComponentProps, useCallback, useEffect, useState } from 'react'
import { PaymentsReceivedTable } from '@app/components/payments-received-table'
import { PaymentDataSource } from '@app/utils/payments/types'
import { useFetchPaymentData } from '@app/hooks/use-fetch-payment-data'
import { getPaymentDataSource } from '@app/utils/payments/helpers'
import { withWalletConnected } from '@app/utils/with-wallet-connected'

function PbmPage() {
    useAppLayoutContext({ pageHeading: 'PBM Dashboard' })

    const { data: signer } = useSigner()
    const { address: connectedAddress } = useAccount()
    const { contract: pbmContract, decimals: pbmDecimals, symbol: pbmSymbol } = usePBMTokenContext()

    const { loading: pbmLoading, balance: pbmBalance } = useTokenBalance({
        account: connectedAddress,
        token: pbmContract?.address,
    })

    const { open } = useTransactionModal()

    const unwrapHandler = async ({
        amount,
        resetForm,
    }: Parameters<NonNullable<ComponentProps<typeof PbmUnwrapCard>['onUnwrap']>>[0]) => {
        if (!pbmContract || !signer) return
        const action = () => pbmContract.connect(signer).redeem(amount)
        const modalDetails = await formatUnwrapModalDetails({
            signer,
            decimals: pbmDecimals,
            pbmAddress: pbmContract.address,
            amount,
            pbmSymbol: pbmSymbol!,
        })
        open(action, modalDetails, (error) => !error && resetForm())
    }

    const [latestBlock, setLatestBlock] = useState<ethers.providers.Block>()
    const [latestBlockLoading, setLatestBlockLoading] = useState<boolean>(false)
    const [paymentDataSource, setPaymentDataSource] = useState<PaymentDataSource[]>([])

    const provider = useProvider()
    const { paymentData, loading: paymentDataLoading } = useFetchPaymentData({
        toAddress: connectedAddress,
    })

    const updateLatestData = useCallback(async () => {
        setLatestBlockLoading(true)
        const blockNumber = await provider.getBlockNumber()
        const block = await provider.getBlock(blockNumber)
        setLatestBlock(block)
        setLatestBlockLoading(false)
    }, [provider])

    const { open: openTransactionModal } = useTransactionModal(
        (success) => success && updateLatestData()
    )

    const refundHandler = (paymentData: PaymentDataSource) => {
        const { depositId } = paymentData
        if (!pbmContract || !depositId || !signer) return
        const action = () => pbmContract.connect(signer as Signer).refund(depositId)

        openTransactionModal(
            action,
            formatRefundModalDetails({ ...paymentData, decimals: pbmDecimals, symbol: pbmSymbol })
        )
    }

    useEffect(() => {
        updateLatestData()
    }, [updateLatestData])

    useEffect(() => {
        if (!latestBlock || !paymentData) return setPaymentDataSource([])
        const paymentDataSource = getPaymentDataSource(paymentData, latestBlock)
        setPaymentDataSource(paymentDataSource)
    }, [latestBlock, paymentData])

    return (
        <div>
            <Row gutter={16}>
                <Col span={14}>
                    <PbmOverviewCard connectedAddress={connectedAddress} pbmBalance={pbmBalance} />
                </Col>
                <Col span={10}>
                    <PbmUnwrapCard
                        pbmSymbol={pbmSymbol}
                        pbmBalance={pbmBalance}
                        pbmDecimals={pbmDecimals}
                        pbmLoading={pbmLoading}
                        onUnwrap={unwrapHandler}
                    />
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <div style={{ paddingTop: '1rem' }}>
                        <h2>My Payments History</h2>
                        <PaymentsReceivedTable
                            latestBlock={latestBlock}
                            decimals={pbmDecimals}
                            loading={paymentDataLoading || latestBlockLoading}
                            dataSource={paymentDataSource}
                            onChargeback={refundHandler}
                        />
                    </div>
                </Col>
            </Row>
        </div>
    )
}

const formatUnwrapModalDetails = async ({
    signer,
    decimals,
    pbmAddress,
    amount,
    pbmSymbol,
}: {
    signer: Signer
    decimals: number
    pbmAddress: string
    amount: BigNumber
    pbmSymbol: string
}) => {
    const signerAddress = await signer.getAddress()

    return {
        Action: 'Unwrap PBM',
        'PBM Address': pbmAddress,
        'From/To Address': signerAddress,
        Amount: `${formatNumberDisplay(
            formatUnits(amount, decimals),
            decimals
        )} ${pbmSymbol.toUpperCase()}`,
    }
}

const formatRefundModalDetails = (
    paymentData: { decimals: number; symbol: string } & PaymentDataSource
) => {
    const { fromAddress, toAddress, decimals, symbol } = paymentData
    return {
        Action: 'Recall Payment',
        'Recall From': toAddress,
        'Return To': fromAddress,
        Amount: `${formatNumberDisplay(
            formatUnits(paymentData.amount, decimals),
            decimals
        )} ${symbol}`,
    }
}

export default withWalletConnected(PbmPage)
