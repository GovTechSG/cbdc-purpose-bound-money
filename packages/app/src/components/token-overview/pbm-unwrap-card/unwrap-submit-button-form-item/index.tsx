import { Button, Form } from 'antd'
import React from 'react'
import styled from '@emotion/styled'

interface UnwrapSubmitButtonFormItemProps {
    pbmSymbol: string | undefined
    disableSubmit: boolean
}

const UnwrapButton = styled(Button)`
    margin-top: 0.5rem;
    width: 100%;
`

export const UnwrapSubmitButtonFormItem: React.FC<UnwrapSubmitButtonFormItemProps> = ({
    pbmSymbol,
    disableSubmit,
}) => {
    return (
        <Form.Item noStyle shouldUpdate>
            <UnwrapButton type="primary" htmlType="submit" size="large" disabled={disableSubmit}>
                Unwrap {pbmSymbol}
            </UnwrapButton>
        </Form.Item>
    )
}
