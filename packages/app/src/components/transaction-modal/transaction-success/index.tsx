import { BlockExplorer } from '@app/components/block-explorer'
import { TransactionResultContentProps } from '@app/components/transaction-modal'
import { TransactionActionButton } from '@app/components/transaction-modal/action-button'
import { Result } from 'antd'
import React, { useEffect } from 'react'

type TransactionSuccessProps = {
    transactionHash: string
} & TransactionResultContentProps

export const TransactionSuccess: React.FC<TransactionSuccessProps> = ({
    setTitle,
    transactionHash,
    onActionClick,
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
            <TransactionActionButton onClick={onActionClick}>OK</TransactionActionButton>
        </div>
    )
}
