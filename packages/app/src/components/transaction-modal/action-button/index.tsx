import { Button } from 'antd'
import React from 'react'
import styled from '@emotion/styled'

const StyledButton = styled(Button)`
    width: 100%;
    height: 45px;
`

export const TransactionActionButton: React.FC<
    React.PropsWithChildren<React.ComponentProps<typeof Button>>
> = ({ children, ...props }) => {
    return (
        <StyledButton type="primary" size="large" {...props}>
            {children}
        </StyledButton>
    )
}
