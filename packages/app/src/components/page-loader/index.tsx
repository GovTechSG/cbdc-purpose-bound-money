import React from 'react'
import styled from '@emotion/styled'
import { Spin } from 'antd'

const LoadingContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    line-height: 3.5rem;
`

export const PageLoader: React.FC = () => {
    return (
        <LoadingContainer>
            <Spin size="large" />
            <div>Loading...</div>
        </LoadingContainer>
    )
}
