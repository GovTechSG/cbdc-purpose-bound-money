import { Form, FormInstance } from 'antd'
import { PaymentRecipientFormItem } from '@app/components/payment-form/recipient-form-item'
import { PaymentInputAmountFormItem } from '@app/components/payment-form/input-amount-form-item'
import { PaymentLockingPeriodFormItem } from '@app/components/payment-form/locking-period-form-item'
import { PaymentAvailableAssetBalanceFormItem } from '@app/components/payment-form/available-asset-balance-form-item'
import React, { forwardRef, useImperativeHandle } from 'react'
import {
    PaymentActionButtonAssetApprovalHandler,
    PaymentActionButtonFormItem,
} from '@app/components/payment-form/action-button-form-item'

type PaymentFormForwardedRef = {
    form: FormInstance
}

type PaymentFormProps = {
    onSubmit?: (values: any) => void
    onApproval?: PaymentActionButtonAssetApprovalHandler
}

export const PaymentForm = forwardRef<PaymentFormForwardedRef, PaymentFormProps>(
    function PaymentForm({ onSubmit, onApproval }, ref) {
        const [form] = Form.useForm()

        const onFinish = (values: any) => {
            onSubmit && onSubmit(values)
        }

        const onFinishFail = (values: any) => {
            console.log('onFinishFail Form values:', values)
        }

        useImperativeHandle(ref, () => ({
            form,
        }))

        return (
            <div>
                <Form
                    form={form}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFail}
                    labelCol={{ span: 8 }}
                    layout="horizontal"
                    size="large"
                >
                    <PaymentRecipientFormItem label="Recipient" />

                    <PaymentInputAmountFormItem formRef={form} label="Payable Amount" />

                    <PaymentLockingPeriodFormItem formRef={form} label="Holding Period" />

                    <PaymentAvailableAssetBalanceFormItem />

                    <PaymentActionButtonFormItem onApproval={onApproval} />
                </Form>
            </div>
        )
    }
)
