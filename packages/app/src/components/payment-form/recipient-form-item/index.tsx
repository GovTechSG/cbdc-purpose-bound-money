import { Form, Select, Space, Tooltip } from 'antd'
import React, { useState } from 'react'
import { ellipsizeAddress } from '@app/utils/helpers'
import { ContactsTwoTone } from '@ant-design/icons'
import { BlockExplorer } from '@app/components/block-explorer'
import { useNetwork } from 'wagmi'
import { getPayees } from '@app/utils/get-app-chain-info'

type PayeeDataSource = {
    name: string
    address: string
}

const recipientSelectLabelRenderer = (payee: PayeeDataSource) => {
    const { name, address } = payee
    const displayAddress = ellipsizeAddress(address)
    return `${name} (0x${displayAddress})`
}

const recipientSelectOptions = (ds: PayeeDataSource[]) =>
    ds.map((payee) => ({
        value: payee.address,
        label: recipientSelectLabelRenderer(payee),
    }))

const SelectedRecipientTip = ({ recipientAddress }: { recipientAddress: string | undefined }) => {
    return recipientAddress ? (
        <Tooltip title="Wallet address of selected recipient" placement="bottom">
            <Space>
                <ContactsTwoTone />
                <BlockExplorer.AddressLink address={recipientAddress as `0x${string}`}>
                    {recipientAddress}
                </BlockExplorer.AddressLink>
            </Space>
        </Tooltip>
    ) : null
}

export const PaymentRecipientFormItem = ({ label }: { label: string }) => {
    const [selectedRecipientAddress, setSelectedRecipientAddress] = useState<string | undefined>()

    const { chain } = useNetwork()

    const recipientSelectChangeHandler = (value: string) => {
        setSelectedRecipientAddress(value)
    }

    return (
        <Form.Item label={label}>
            <Space direction="vertical">
                <Form.Item
                    name="payee"
                    noStyle
                    rules={[
                        {
                            required: true,
                            message: 'Recipient is required',
                        },
                    ]}
                >
                    <Select
                        placeholder="Select a Recipient"
                        style={{ minWidth: 300 }}
                        options={recipientSelectOptions(getPayees(chain?.id))}
                        onChange={recipientSelectChangeHandler}
                    />
                </Form.Item>
                <SelectedRecipientTip recipientAddress={selectedRecipientAddress} />
            </Space>
        </Form.Item>
    )
}
