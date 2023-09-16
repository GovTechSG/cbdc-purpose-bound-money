import React, { useEffect } from 'react'
import { Result } from 'antd'
import { TransactionActionButton } from '@app/components/transaction-modal/action-button'
import { TransactionResultContentProps } from '@app/components/transaction-modal'

type TransactionErrorProps = {
    error: string
} & TransactionResultContentProps

export const TransactionError: React.FC<TransactionErrorProps> = ({
    error,
    onActionClick,
    setTitle,
}) => {
    useEffect(() => {
        setTitle('Error')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div style={{ maxWidth: '30rem', minWidth: '25rem' }}>
            <Result status="error" title="Transaction Failed" subTitle={error} />
            <TransactionActionButton onClick={onActionClick}>Dismiss</TransactionActionButton>
        </div>
    )
}
