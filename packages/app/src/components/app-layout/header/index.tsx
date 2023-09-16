import styled from '@emotion/styled'
import React from 'react'
import { Col, Row, theme, Layout } from 'antd'
import { ConnectButton } from '@rainbow-me/rainbowkit'

const { Header } = Layout

const HeaderContentBox = styled.div`
    padding: 0 2rem;
`

type HeaderContentColProps = {
    align?: 'left' | 'right'
} & React.ComponentProps<typeof Col>

const HeaderContentCol = styled(Col)<HeaderContentColProps>`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: ${({ align }) => (align === 'right' ? 'flex-end' : 'flex-start')};
`

const HeaderContent = ({ children }: { children: React.ReactNode }) => {
    return (
        <HeaderContentBox>
            <Row gutter={16}>
                <HeaderContentCol span={12}>{children}</HeaderContentCol>
                <HeaderContentCol span={12} align="right">
                    <ConnectButton />
                </HeaderContentCol>
            </Row>
        </HeaderContentBox>
    )
}

const HeaderContentTitle = styled.h2`
    margin: 0;
`

export const LayoutHeader = ({ title }: { title: string }) => {
    const {
        token: { colorBgContainer },
    } = theme.useToken()

    return (
        <Header style={{ padding: 0, background: colorBgContainer }}>
            <HeaderContent>
                <HeaderContentTitle>{title}</HeaderContentTitle>
            </HeaderContent>
        </Header>
    )
}
