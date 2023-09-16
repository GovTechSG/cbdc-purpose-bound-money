import { bigNumberInputAmountValidator } from '@app/utils/validators/bignumber-input-amount-validator'
import { BigNumberInput } from '@app/components/big-number-input'
import { Form } from 'antd'
import React from 'react'
import { BigNumber } from 'ethers'

interface UnwrapInputAmountFormItemProps {
    pbmSymbol: string | undefined
    pbmBalance: BigNumber
    pbmDecimals: number
}

export const UnwrapInputAmountFormItem: React.FC<UnwrapInputAmountFormItemProps> = ({
    pbmSymbol,
    pbmBalance,
    pbmDecimals,
}) => {
    return (
        <Form.Item
            shouldUpdate={true}
            name="inputAmount"
            initialValue=""
            style={{ marginBottom: 0 }}
            rules={[
                {
                    validator: bigNumberInputAmountValidator({
                        tokenBalance: pbmBalance,
                        tokenDecimals: pbmDecimals,
                        tokenSymbol: pbmSymbol,
                    }),
                },
            ]}
        >
            <BigNumberInput
                decimals={pbmDecimals || 0}
                placeholder={`Amount of ${pbmSymbol} to unwrap`}
                size="large"
                style={{ width: '100%' }}
                addonAfter={pbmSymbol}
            />
        </Form.Item>
    )
}
