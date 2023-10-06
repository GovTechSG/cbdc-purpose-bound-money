import { Form, FormInstance, Select, Space, Tooltip, Typography } from 'antd'
import { InfoCircleTwoTone } from '@ant-design/icons'
import React, { useCallback, useEffect, useState } from 'react'
import { formatNumberDisplay } from '@app/utils/helpers'
import debounce from 'lodash.debounce'
import { BigNumberInput } from '@app/components/big-number-input'
import { useAssetTokenContext } from '@app/contexts/asset-token-context'
import { useTokenBalance } from '@app/hooks/use-token-balance'
import { bigNumberInputAmountValidator } from '@app/utils/validators/bignumber-input-amount-validator'

type PaymentInputAmountFormItemProps = {
    label: string
    formRef: FormInstance
}

export const PaymentInputAmountFormItem = ({ label, formRef }: PaymentInputAmountFormItemProps) => {
    const [showEstimatedPbm, setShowEstimatedPbm] = useState(false)
    const [hasValidationErrors, setHasValidationErrors] = useState(false)
    const [baseAmount, setBaseAmount] = useState<string>()

    // baseCurrency is largely not used for now after a change in business decision to only accept SGD
    const [baseCurrency, _setBaseCurrency] = useState<string>('DSGD')

    const {
        decimals: assetDecimals,
        symbol: assetSymbol,
        address: assetAddress,
    } = useAssetTokenContext()
    const { balance: assetBalance } = useTokenBalance({ token: assetAddress })

    const validationStatusHandler = useCallback(async () => {
        try {
            await formRef.validateFields([
                ['inputAmount', 'baseCurrency'],
                ['inputAmount', 'baseAmount'],
            ])
            setHasValidationErrors(false)
        } catch (e) {
            setHasValidationErrors(true)
            console.error(e)
        }
    }, [formRef])

    const fieldsValueChangeHandler = useCallback(
        () =>
            debounce(async () => {
                const { baseAmount: inputBaseAmount } = formRef.getFieldValue('inputAmount')
                setBaseAmount(inputBaseAmount)
                // setBaseCurrency(inputBaseCurrency)
            }, 500)(),
        [formRef]
    )

    const inputAmountChangeHandler = useCallback(async () => {
        await Promise.all([fieldsValueChangeHandler(), validationStatusHandler()])
    }, [fieldsValueChangeHandler, validationStatusHandler])

    // Determine PBM estimation should be shown or not
    useEffect(() => {
        const isInputAmountTouched = formRef.isFieldTouched('inputAmount')
        setShowEstimatedPbm(isInputAmountTouched && !hasValidationErrors)
    }, [formRef, hasValidationErrors, baseAmount])

    return (
        <>
            <Form.Item label={label} style={{ marginBottom: showEstimatedPbm ? 0 : '2rem' }}>
                <Space.Compact size="large" style={{ width: '100%' }}>
                    <Form.Item
                        name={['inputAmount', 'baseCurrency']}
                        noStyle
                        initialValue={baseCurrency}
                        rules={[
                            {
                                required: true,
                                message: 'Base currency must be selected',
                            },
                        ]}
                    >
                        <Select
                            placeholder="Select Currency"
                            style={{ width: 'auto' }}
                            onChange={inputAmountChangeHandler}
                            open={false}
                            showArrow={false}
                        >
                            <Select.Option value={assetSymbol}>{assetSymbol} $</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name={['inputAmount', 'baseAmount']}
                        noStyle
                        initialValue=""
                        rules={[
                            {
                                required: true,
                                validator: bigNumberInputAmountValidator({
                                    tokenBalance: assetBalance,
                                    tokenDecimals: assetDecimals,
                                    tokenSymbol: assetSymbol,
                                    required: true,
                                }),
                            },
                        ]}
                    >
                        <BigNumberInput
                            decimals={assetDecimals || 0}
                            style={{ maxWidth: '25rem', width: '50%' }}
                            placeholder="Input amount"
                            onChange={inputAmountChangeHandler}
                        />
                    </Form.Item>
                </Space.Compact>
            </Form.Item>
            {showEstimatedPbm && (
                <Form.Item wrapperCol={{ offset: 8, span: 16 }} style={{ marginBottom: '1rem' }}>
                    <Space>
                        <Tooltip
                            title="Note that minted amount may differ slightly due to price fluctuation in different currencies."
                            placement="bottom"
                        >
                            <InfoCircleTwoTone />
                        </Tooltip>
                        <Typography.Text>
                            Estimated PBM: {formatNumberDisplay(baseAmount, assetDecimals)}
                        </Typography.Text>
                    </Space>
                </Form.Item>
            )}
        </>
    )
}
