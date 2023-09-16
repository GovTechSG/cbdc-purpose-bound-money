import styled from '@emotion/styled'
import { Descriptions } from 'antd'
import { TransactionActionButton } from '@app/components/transaction-modal/action-button'
import React, { useEffect } from 'react'
import { TransactionResultContentProps } from '@app/components/transaction-modal'

const StyledTransactionDetailContainer = styled.div`
    & .image-container {
        width: 100%;
        display: flex;
        justify-content: center;
        padding: 1rem 0;

        & .check-wallet-image {
            --image-size: 12.5rem;

            background-image: url('/images/wallet-check.jpg');
            width: var(--image-size);
            height: var(--image-size);
            background-size: calc(var(--image-size) * 1.3);
            background-position: center;
            border-radius: calc(var(--image-size) / 2);
            background-position-y: -1rem;
            background-repeat: no-repeat;
        }
    }

    .description {
        padding: 0 0 1rem 0;
    }
`

type TransactionDetailProps = {
    details: Record<any, any>
} & TransactionResultContentProps

export const TransactionDetail: React.FC<TransactionDetailProps> = ({
    onActionClick,
    setTitle,
    details,
}) => {
    useEffect(() => {
        setTitle('Confirm Transaction')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const descriptionItems = details
        ? Object.keys(details).map((label, idx) => (
              <Descriptions.Item label={label} key={idx}>
                  {details[label]}
              </Descriptions.Item>
          ))
        : []

    return (
        <StyledTransactionDetailContainer>
            <div className="image-container">
                <div className="check-wallet-image" />
            </div>
            <Descriptions title="Details" bordered column={1} size="small" className="description">
                {descriptionItems}
            </Descriptions>
            <TransactionActionButton onClick={onActionClick}>Confirm</TransactionActionButton>
        </StyledTransactionDetailContainer>
    )
}
