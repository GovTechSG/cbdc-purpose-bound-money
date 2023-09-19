'use client'

import { pageInfo } from '@app/common/config/page-info'
import { AddressTooltip } from '@app/components/address-tooltip'
import { LayoutHeader } from '@app/components/app-layout/header'
import { BlockExplorer } from '@app/components/block-explorer'
import { usePBMTokenContext } from '@app/contexts/pbm-token-context'
import { useConnectedHasAdministrativeRoles } from '@app/hooks/use-connected-has-administrative-roles'
import { useIsMounted } from '@app/hooks/use-is-mounted'
import { useTokenBalance } from '@app/hooks/use-token-balance'
import { ellipsizeAddress, formatNumberDisplay } from '@app/utils/helpers'
import styled from '@emotion/styled'
import { Layout, Menu, theme } from 'antd'
import Head from 'next/head'
import { usePathname, useRouter } from 'next/navigation'
import React, { createContext, useMemo } from 'react'
import { useAccount } from 'wagmi'

const { Content, Footer, Sider } = Layout

const contextDefaultReadValues = {
    pageHeading: 'Purpose Bound Money (PBM) Portal',
}

const contextDefaultFunctions = {
    setPageHeading: (_heading: string) => {},
}

const contextDefaultValues = {
    ...contextDefaultReadValues,
    ...contextDefaultFunctions,
}

const AppLayoutContext = createContext(contextDefaultValues)

const AppLogo = styled.div`
    :before {
        font-size: 8rem;
        height: auto;
        margin-bottom: -1rem;
        display: flex;
        position: relative;
        justify-content: center;
        content: '🌸';
    }

    h1 {
        color: white;
        text-align: center;
        font-size: 1.3rem;
        margin: 0;
    }

    padding: 1rem 0 2rem 0;
`

const AssetTokenBalance = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    position: absolute;
    height: 100%;
    width: 100%;
    bottom: 0;
    color: white;
    font-size: 0.75rem;
    pointer-events: none;

    & .container {
        position: sticky;
        display: flex;
        justify-content: flex-start;
        flex-direction: column;
        background-color: #010a13;
        padding: 1rem;
        bottom: 0;
        width: auto;
        height: auto;
        pointer-events: bounding-box;

        h5 {
            padding: 0;
            margin: 0.2rem 0;
        }

        a {
            color: white;
        }
    }
`

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
    const [pageHeading, setPageHeading] = React.useState(contextDefaultValues.pageHeading)
    const [siderCollapsed, setSiderCollapsed] = React.useState(false)
    const values = useMemo(() => ({ pageHeading, setPageHeading }), [pageHeading, setPageHeading])

    const {
        token: { colorBgContainer },
    } = theme.useToken()

    const router = useRouter()
    const pathname = usePathname()

    const { hasAdministrativeRoles } = useConnectedHasAdministrativeRoles()

    const isMounted = useIsMounted()
    const { isConnected, address: connectedAddress } = useAccount()

    const { contract: pbmContract, asset: assetAddress } = usePBMTokenContext()
    const { decimalBalance: pbmDecimalBalance, symbol: pbmSymbol } = useTokenBalance({
        token: pbmContract?.address,
    })
    const { decimalBalance: assetDecimalBalance, symbol: assetSymbol } = useTokenBalance({
        token: assetAddress,
    })

    const isMountedAndConnected = isMounted && isConnected

    const navMenuClickHandler = (e: any) => {
        router.push(e.key)
    }

    const siderCollapseHandler = (collapsed: boolean) => {
        setSiderCollapsed(collapsed)
    }

    return (
        <AppLayoutContext.Provider value={values}>
            {isMounted && (
                <Head>
                    <title>{pageHeading} – Purpose Bound Money (PBM)</title>
                    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                    <link rel="manifest" href="/site.webmanifest" />
                </Head>
            )}
            <Layout style={{ minHeight: '100vh' }}>
                <Sider breakpoint="xl" collapsedWidth="0" onCollapse={siderCollapseHandler}>
                    <AppLogo>
                        <h1>Project Orchid SkillsFuture SG</h1>
                    </AppLogo>
                    <Menu
                        theme="dark"
                        mode="inline"
                        defaultSelectedKeys={['/pbm']}
                        selectedKeys={[pathname!]}
                        onClick={navMenuClickHandler}
                        items={pageInfo
                            .filter((item) => !item.hidden || hasAdministrativeRoles)
                            .map(({ hidden, ...rest }) => ({ ...rest }))}
                    />
                    {!siderCollapsed && (
                        <AssetTokenBalance>
                            <div className="container">
                                <div>
                                    <h5>
                                        Wallet Balances{' '}
                                        {isMountedAndConnected ? (
                                            <>
                                                (
                                                <BlockExplorer.AddressLink
                                                    address={connectedAddress!}
                                                >
                                                    {ellipsizeAddress(
                                                        connectedAddress as string,
                                                        8
                                                    )}
                                                </BlockExplorer.AddressLink>
                                                )
                                            </>
                                        ) : null}
                                    </h5>
                                    {isMountedAndConnected ? (
                                        <>
                                            <div>
                                                💵{' '}
                                                <AddressTooltip address={assetAddress!}>
                                                    {assetSymbol}
                                                </AddressTooltip>
                                                : {formatNumberDisplay(assetDecimalBalance, 4)}
                                            </div>
                                            <div>
                                                🪙{' '}
                                                <AddressTooltip address={pbmContract?.address!}>
                                                    {pbmSymbol}
                                                </AddressTooltip>
                                                : {formatNumberDisplay(pbmDecimalBalance, 4)}
                                            </div>
                                        </>
                                    ) : (
                                        <div>🔴 Not connected</div>
                                    )}
                                </div>
                            </div>
                        </AssetTokenBalance>
                    )}
                </Sider>
                <Layout>
                    <LayoutHeader title={pageHeading} />
                    <Content style={{ margin: '24px 16px 0' }}>
                        <div
                            style={{
                                padding: 24,
                                minHeight: 360,
                                height: '100%',
                                background: colorBgContainer,
                            }}
                        >
                            {children}
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center', fontSize: 'small' }}>
                        Built with ❤️ by GovTech for Project Orchid
                    </Footer>
                </Layout>
            </Layout>
        </AppLayoutContext.Provider>
    )
}

export const useAppLayoutContext = ({ pageHeading }: typeof contextDefaultReadValues) => {
    const context = React.useContext(AppLayoutContext)

    React.useEffect(() => {
        context.setPageHeading(pageHeading)
    }, [context, pageHeading])

    return context
}
