import { CopyOutlined } from '@ant-design/icons'
import { BlockExplorer } from '@app/components/block-explorer'
import { resolveAddressName } from '@app/utils/address-book'
import { Tooltip, message } from 'antd'
import copy from 'copy-to-clipboard'
import React from 'react'
import { useAccount, useNetwork } from 'wagmi'

interface AddressTooltipProps extends React.PropsWithChildren {
    address: `0x${string}` | string
}

export const AddressTooltip: React.FC<AddressTooltipProps> = ({ address, children }) => {
    const { chain } = useNetwork()
    const { address: connectedAddress } = useAccount()
    const [messageApi, contextHolder] = message.useMessage()

    const getTooltipText = (address: `0x${string}` | string) => {
        const name = resolveAddressName(address, chain?.id) ?? 'Unknown Address'
        const typeLabelStyle: React.CSSProperties = { fontSize: 'smaller', color: '#cccccc' }

        const isSelf = address && address.toLowerCase() === connectedAddress?.toLowerCase()

        const copyAddress = async () => {
            const res = copy(address)
            if (res) {
                await messageApi.info('Address copied to clipboard')
            }
        }

        return (
            <>
                {contextHolder}
                <div>
                    <div style={typeLabelStyle}>Name:</div>
                    {name}
                    {isSelf && ' (You)'}
                </div>
                <div>
                    <div style={typeLabelStyle}>Address:</div>
                    {address}{' '}
                    <span title="Copy Address">
                        <CopyOutlined onClick={copyAddress} />
                    </span>
                </div>
            </>
        )
    }

    return (
        <Tooltip title={getTooltipText(address)} placement="bottomLeft">
            <BlockExplorer.AddressLink address={address}>{children}</BlockExplorer.AddressLink>
        </Tooltip>
    )
}
