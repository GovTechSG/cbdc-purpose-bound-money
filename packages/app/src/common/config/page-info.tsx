import { DashboardOutlined, SendOutlined, UnorderedListOutlined } from '@ant-design/icons'
import Link from 'next/link'
import React from 'react'

type PageInfo = {
    key: string
    icon: React.ReactNode
    label: React.ReactNode
    hidden: boolean
}

export const pageInfo: PageInfo[] = [
    {
        key: '/pbm',
        icon: <DashboardOutlined />,
        label: <Link href="/pbm">My PBM</Link>,
        hidden: false,
    },
    {
        key: '/send',
        icon: <SendOutlined />,
        label: <Link href="/send">Wrap and Send</Link>,
        hidden: true,
    },
    {
        key: '/payments',
        icon: <UnorderedListOutlined />,
        label: <Link href="/payments">All Payments</Link>,
        hidden: true,
    },
]
