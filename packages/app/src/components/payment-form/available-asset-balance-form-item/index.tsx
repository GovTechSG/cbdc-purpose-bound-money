import { Form, Space, Tooltip, Typography } from 'antd'
import { formatNumberDisplay } from '@app/utils/helpers'
import { InfoCircleTwoTone } from '@ant-design/icons'
import React from 'react'
import { useAssetTokenContext } from '@app/contexts/asset-token-context'
import { useTokenBalance } from '@app/hooks/use-token-balance'
import { SkeletonLoader } from '@app/components/skeleton-loader'

export const PaymentAvailableAssetBalanceFormItem = () => {
    const {
        decimals: assetDecimals,
        symbol: assetSymbol,
        address: assetAddress,
    } = useAssetTokenContext()
    const { decimalBalance: assetDecimalBalance } = useTokenBalance({ token: assetAddress })

    return (
        <Form.Item label={`Available ${assetSymbol} Balance`}>
            <SkeletonLoader.Input loading={!assetDecimalBalance}>
                <Space>
                    <Typography.Text>
                        {formatNumberDisplay(assetDecimalBalance)} {assetSymbol}
                    </Typography.Text>
                    <Tooltip
                        title={`${assetSymbol}$ ${formatNumberDisplay(
                            assetDecimalBalance,
                            assetDecimals
                        )}`}
                        placement="right"
                    >
                        <InfoCircleTwoTone />
                    </Tooltip>
                </Space>
            </SkeletonLoader.Input>
        </Form.Item>
    )
}
