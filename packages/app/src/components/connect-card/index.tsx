import React from 'react'
import { Space, Typography } from 'antd'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import styled from '@emotion/styled'

const { Title } = Typography

const LoginContainer = styled(Space)`
    justify-content: center;
    flex-direction: column;
    text-align: center;
    width: 100%;
    height: 100%;
    padding: 0.5rem 0;
`

const Loading: React.FC = () => (
    <LoginContainer>
        <Title level={4}>Connecting...</Title>
    </LoginContainer>
)

const Connected: React.FC = () => (
    <LoginContainer>
        <Title level={4}>✅ Connected! Hang on...</Title>
    </LoginContainer>
)

const Denied: React.FC = () => (
    <LoginContainer>
        <Title level={4}>🚫 You seem to have reached a wrong page!</Title>
    </LoginContainer>
)

const Connect: React.FC = () => (
    <LoginContainer>
        <Title level={4}>Connect and Sign In with your Wallet</Title>
        <ConnectButton />
    </LoginContainer>
)

export const ConnectCard = {
    Loading,
    Connected,
    Denied,
    Connect,
}
