import { BigNumber } from 'ethers'
import { parseUnits } from 'ethers/lib/utils'

type BigNumberInputAmountValidatorParams = {
    tokenBalance: BigNumber
    tokenDecimals: number
    tokenSymbol: string | undefined
    required?: boolean
}

export const bigNumberInputAmountValidator =
    ({
        tokenBalance,
        tokenDecimals,
        tokenSymbol,
        required = false,
    }: BigNumberInputAmountValidatorParams) =>
    async (_: any, value: string) => {
        if (!required && !value) return Promise.resolve()
        if (required && !value) return Promise.reject('Input amount is required')
        const pbmAmount = parseUnits(value, tokenDecimals)
        if (pbmAmount.lte(BigNumber.from(0))) {
            return Promise.reject('Amount must be more than zero')
        }
        if (pbmAmount.gt(tokenBalance)) {
            return Promise.reject(`Insufficient ${tokenSymbol ?? ''} balance`)
        } else {
            return Promise.resolve()
        }
    }
