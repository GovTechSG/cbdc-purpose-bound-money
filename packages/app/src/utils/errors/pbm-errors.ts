import { PBMVault__factory, PBM__factory } from '@contracts/types'
import { decodeError, ErrorType } from 'ethers-decode-error'
import type { DecodedError } from 'ethers-decode-error'

export const parseTransactionError = (error: any): string => {
    let errData: DecodedError
    try {
        errData = decodeError(error, PBM__factory.createInterface())
    } catch (e) {
        errData = decodeError(error, PBMVault__factory.createInterface())
    }

    if (errData.type !== ErrorType.CustomError) {
        return errData.error
    }
    return customErrorToReason(errData)
}

const customErrorToReason = ({ error, args }: DecodedError): string => {
    switch (error) {
        case 'UnauthorisedCaller':
            return `Caller ${args?.[0]} is not authorised`
        case 'InvalidActiveDeposit':
            return 'Invalid active deposit'
        case 'DepositAlreadyMatured':
            return 'Payment has already matured beyond its holding period'
        case 'AccountHasNoRole':
            return `Address ${args?.[0]} is not a whitelisted participant`
        case 'DepositNotMatured':
            return `One or more deposits have not matured`
        default:
            return error
    }
}
