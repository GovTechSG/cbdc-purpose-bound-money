import React, { useEffect } from 'react'
import { Button, Form, Space } from 'antd'
import { SendOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { usePBMTokenContext } from '@app/contexts/pbm-token-context'
import { useAssetTokenContext } from '@app/contexts/asset-token-context'
import { useTokenBalance } from '@app/hooks/use-token-balance'
import { BigNumber } from 'ethers'

export type PaymentActionButtonAssetApprovalHandler = (assetBalance: BigNumber) => Promise<void>

type PaymentActionButtonFormItemProps = {
    onApproval?: PaymentActionButtonAssetApprovalHandler
}

export const PaymentActionButtonFormItem: React.FC<PaymentActionButtonFormItemProps> = ({
    onApproval,
}) => {
    const [requireApproval, setRequireApproval] = React.useState(false)
    const { assetAllowance, reload: reloadPbmContext } = usePBMTokenContext()
    const { symbol: assetSymbol, address: assetAddress } = useAssetTokenContext()
    const { balance: assetBalance } = useTokenBalance({ token: assetAddress })

    useEffect(() => {
        if (assetAllowance !== undefined && !requireApproval) {
            setRequireApproval(assetAllowance.eq(0))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assetAllowance])

    const approveClickHandler = async () => {
        try {
            await onApproval?.(assetBalance)
            await reloadPbmContext()
        } catch (_) {}
    }

    return (
        <Form.Item label=" " colon={false}>
            <Space>
                {requireApproval && (
                    <>
                        <Button
                            type="primary"
                            onClick={approveClickHandler}
                            disabled={assetBalance.eq(0) || assetAllowance?.gt(0)}
                        >
                            Approve {assetSymbol}
                        </Button>
                        <ArrowRightOutlined />
                    </>
                )}
                <Button type="primary" htmlType="submit" disabled={assetAllowance?.eq(0)}>
                    <Space>
                        <SendOutlined />
                        <>Wrap and Send Payment</>
                    </Space>
                </Button>
            </Space>
        </Form.Item>
    )
}
