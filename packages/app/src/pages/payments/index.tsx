'use client'

import { AddressBookLabelWithTooltip } from '@app/components/address-book-label-with-tooltip'
import { useAppLayoutContext } from '@app/components/app-layout'
import { PaymentsListingTable } from '@app/components/payments-listing-table'
import { usePBMTokenContext } from '@app/contexts/pbm-token-context'
import { useTransactionModal } from '@app/contexts/transaction-modal-context'
import { useFetchPaymentData } from '@app/hooks/use-fetch-payment-data'
import { useSafeProvider } from '@app/hooks/use-safe-provider'
import { formatNumberDisplay } from '@app/utils/helpers'
import { getPaymentDataSource } from '@app/utils/payments/helpers'
import { PaymentDataSource } from '@app/utils/payments/types'
import { withWalletConnected } from '@app/utils/with-wallet-connected'
import { Button, Space } from 'antd'
import { ethers, Signer } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import React, { ElementRef, useCallback, useEffect, useRef, useState } from 'react'
import { useSigner } from 'wagmi'

function PaymentsPage() {
    useAppLayoutContext({ pageHeading: 'All Payments' })

    const paymentsTable = useRef<ElementRef<typeof PaymentsListingTable>>(null)

    const [latestBlock, setLatestBlock] = useState<ethers.providers.Block>()
    const [latestBlockLoading, setLatestBlockLoading] = useState<boolean>(false)
    const [paymentDataSource, setPaymentDataSource] = useState<PaymentDataSource[]>([])

    const provider = useSafeProvider()
    const { data: signer } = useSigner()
    const { decimals, contract: pbmContract, symbol } = usePBMTokenContext()
    const { paymentData, loading: paymentDataLoading } = useFetchPaymentData()

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

    const chargebackHandler = (paymentData: PaymentDataSource) => {
        const { toAddress, depositId } = paymentData
        if (!pbmContract || !depositId || !signer) return
        const action = () => pbmContract.connect(signer as Signer).chargeback(toAddress, depositId)

        openTransactionModal(action, formatModalDetails({ ...paymentData, decimals, symbol }))
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
        <>
            <Space style={{ justifyContent: 'flex-end', width: '100%', padding: ' 0.5rem 0' }}>
                <Button
                    type="primary"
                    onClick={() => updateLatestData()}
                    loading={paymentDataLoading || latestBlockLoading}
                >
                    Refresh
                </Button>
                <Button onClick={() => paymentsTable.current?.clearFilters()}>Clear Filters</Button>
            </Space>
            <PaymentsListingTable
                ref={paymentsTable}
                latestBlock={latestBlock}
                decimals={decimals}
                loading={paymentDataLoading || latestBlockLoading}
                dataSource={paymentDataSource}
                onChargeback={chargebackHandler}
            />
        </>
    )
}

const formatModalDetails = (
    paymentData: { decimals: number; symbol: string } & PaymentDataSource
) => {
    const { fromAddress, toAddress, decimals, symbol } = paymentData
    return {
        Action: 'Recall Payment',
        'Recall From': <AddressBookLabelWithTooltip address={toAddress} />,
        'Return To': <AddressBookLabelWithTooltip address={fromAddress} />,
        Amount: `${formatNumberDisplay(
            formatUnits(paymentData.amount, decimals),
            decimals
        )} ${symbol}`,
    }
}

export default withWalletConnected(PaymentsPage)
