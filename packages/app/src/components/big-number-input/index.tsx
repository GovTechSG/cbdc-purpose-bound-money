import { Input } from 'antd'
import React, { ChangeEvent } from 'react'

type BigNumberInputProps = Parameters<typeof Input>[0] & {
    decimals: number
}

export const BigNumberInput = (props: BigNumberInputProps) => {
    const { decimals, onChange } = props

    const inputChangeHandler = async (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target
        const reg = /^(\d+)+(\.)?(\d+)?$/
        const reachedMaxLength = value?.split('.')[1]?.length > decimals
        if ((!value || reg.test(value)) && !reachedMaxLength) {
            if (onChange) {
                await onChange(event)
            }
            return value
        } else {
            event.preventDefault()
        }
    }

    return <Input {...props} onChange={inputChangeHandler} />
}
