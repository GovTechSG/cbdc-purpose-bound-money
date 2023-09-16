import { Checkbox, Form, FormInstance, InputNumber } from 'antd'
import React, { useState } from 'react'
import { CheckboxChangeEvent } from 'antd/es/checkbox'

type PaymentLockingPeriodFormItemProps = {
    formRef: FormInstance
    label: string
}

export const PaymentLockingPeriodFormItem = ({
    formRef,
    label,
}: PaymentLockingPeriodFormItemProps) => {
    const [immediatePayment, setImmediatePayment] = useState(false)

    const immediatePaymentChangeHandler = (e: CheckboxChangeEvent) => {
        setImmediatePayment(e.target.checked)
        formRef.resetFields(['lockPeriod'])
        if (e.target.checked) {
            formRef.setFieldValue('lockPeriod', 0)
        } else {
            formRef.setFieldValue('lockPeriod', 14)
        }
    }

    return (
        <>
            <Form.Item
                label={label}
                name="lockPeriod"
                initialValue={14}
                rules={[
                    {
                        required: !immediatePayment,
                        message: 'Holding period is required',
                    },
                    {
                        min: immediatePayment ? 0 : 1,
                        type: 'number',
                        message: 'Holding period must be at least 1 day',
                    },
                ]}
                style={{ marginBottom: 0 }}
            >
                <InputNumber
                    addonAfter="Days"
                    minLength={1}
                    maxLength={3}
                    style={{ width: '8rem' }}
                    disabled={immediatePayment}
                />
            </Form.Item>
            <Form.Item
                wrapperCol={{ offset: 8, span: 16 }}
                name="immediatePayment"
                valuePropName="checked"
                initialValue={false}
                style={{ marginBottom: '0.4rem' }}
            >
                <Checkbox onChange={immediatePaymentChangeHandler} value={immediatePayment}>
                    Immediate payment without holding period
                </Checkbox>
            </Form.Item>
        </>
    )
}
