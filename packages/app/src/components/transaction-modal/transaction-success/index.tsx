import React, { useEffect } from 'react'
import { Result } from 'antd'
import { TransactionResultContentProps } from '@app/components/transaction-modal'
import { BlockExplorer } from '@app/components/block-explorer'

type TransactionSuccessProps = {
    transactionHash: string
} & TransactionResultContentProps

export const TransactionSuccess: React.FC<TransactionSuccessProps> = ({
    setTitle,
    transactionHash,
}) => {
    useEffect(() => {
        setTitle('Done')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div style={{ maxWidth: '35rem', minWidth: '25rem' }}>
            <Result
                status="success"
                title="Transaction Completed!"
                subTitle={
                    <BlockExplorer.TransactionLink hash={transactionHash}>
                        View Transaction
                    </BlockExplorer.TransactionLink>
                }
            />
        </div>
    )
}
