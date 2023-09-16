import React, { useEffect } from 'react'
import { Result, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { TransactionResultContentProps } from '@app/components/transaction-modal'
import { BlockExplorer } from '@app/components/block-explorer'

type TransactionProgressProps = {
    transactionHash: string | undefined
} & TransactionResultContentProps

const loadingIcon = <Spin indicator={<LoadingOutlined style={{ fontSize: 72 }} spin />} />

export const TransactionProgress: React.FC<TransactionProgressProps> = ({
    setTitle,
    transactionHash,
}) => {
    useEffect(() => {
        setTitle('')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    let resultProps: React.ComponentProps<typeof Result> = {
        title: 'Waiting for confirmation...',
        subTitle: 'Confirm this transaction in your wallet',
    }
    if (transactionHash) {
        resultProps = {
            title: 'Sending transaction, please wait...',
            subTitle: (
                <BlockExplorer.TransactionLink hash={transactionHash}>
                    View Transaction
                </BlockExplorer.TransactionLink>
            ),
        }
    }

    return (
        <div style={{ maxWidth: '35rem', minWidth: '25.5rem' }}>
            <Result icon={loadingIcon} {...resultProps} />
        </div>
    )
}
