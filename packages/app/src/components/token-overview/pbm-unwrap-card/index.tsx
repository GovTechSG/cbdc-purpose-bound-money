import { SkeletonLoader } from '@app/components/skeleton-loader'
import { DashboardCard } from '@app/components/token-overview/dashboard-card'
import { UnwrapInputAmountFormItem } from '@app/components/token-overview/pbm-unwrap-card/unwrap-input-amount-form-item'
import { UnwrapSubmitButtonFormItem } from '@app/components/token-overview/pbm-unwrap-card/unwrap-submit-button-form-item'
import { formatNumberDisplay } from '@app/utils/helpers'
import styled from '@emotion/styled'
import { Form, Space, Typography } from 'antd'
import { BigNumber } from 'ethers'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import React from 'react'

const { Link } = Typography

interface PbmUnwrapCardProps {
    pbmSymbol: string | undefined
    pbmBalance: BigNumber
    pbmDecimals: number
    pbmLoading: boolean
    onUnwrap?: ({
        amount,
        resetForm,
    }: {
        amount: BigNumber
        resetForm: () => void
    }) => Promise<void>
}

const InputAmountLabel = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    & .pbm-balance-label {
        font-size: 0.8rem;

        a {
            font-size: 0.8rem;
        }
    }
`

export const PbmUnwrapCard: React.FC<PbmUnwrapCardProps> = ({
    pbmSymbol,
    pbmBalance,
    pbmDecimals,
    pbmLoading,
    onUnwrap,
}) => {
    const [disableSubmit, setDisableSubmit] = React.useState(true)

    const [form] = Form.useForm()

    const balanceDisplayFormat = formatNumberDisplay(
        formatUnits(pbmBalance, pbmDecimals),
        pbmDecimals
    )

    const onFinish = (values: any) => {
        if (!values.inputAmount) return
        const resetForm = () => {
            form.resetFields()
            setDisableSubmit(true)
        }
        const amount = parseUnits(values.inputAmount, pbmDecimals)
        onUnwrap && onUnwrap({ amount, resetForm })
    }

    const formValuesChangeHandler = async () => {
        try {
            await form.validateFields()
        } catch {}
        const hasErr = !!form.getFieldsError().filter(({ errors }) => errors.length).length
        const inputAmountValue = form.getFieldValue('inputAmount')
        setDisableSubmit(!inputAmountValue || hasErr)
    }

    const balanceClickHandler = async () => {
        form.setFieldsValue({
            inputAmount: balanceDisplayFormat,
        })
        // Re-trigger the form validation for the submit button
        await formValuesChangeHandler()
    }

    return (
        <DashboardCard title={`Unwrap ${pbmSymbol}`}>
            <Space direction="vertical" style={{ width: '100%' }}>
                <InputAmountLabel>
                    <div className="unwrap-input-label">Unwrap Amount:</div>
                    <div className="pbm-balance-label">
                        Balance in Wallet:{' '}
                        <SkeletonLoader.Input loading={pbmLoading}>
                            <Link onClick={balanceClickHandler}>{balanceDisplayFormat}</Link>
                        </SkeletonLoader.Input>
                    </div>
                </InputAmountLabel>

                <Form
                    form={form}
                    size="large"
                    onFinish={onFinish}
                    onValuesChange={formValuesChangeHandler}
                >
                    <UnwrapInputAmountFormItem
                        pbmSymbol={pbmSymbol}
                        pbmBalance={pbmBalance}
                        pbmDecimals={pbmDecimals}
                    />
                    <UnwrapSubmitButtonFormItem
                        pbmSymbol={pbmSymbol}
                        disableSubmit={disableSubmit}
                    />
                </Form>
            </Space>
        </DashboardCard>
    )
}
