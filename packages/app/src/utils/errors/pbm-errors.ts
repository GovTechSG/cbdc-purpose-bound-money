import { PBMVault__factory, PBM__factory } from '@pbm/contracts'
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
        // PBM Errors
        case 'UnauthorisedCaller':
            return `Caller ${args?.[0]} is not authorised`
        case 'AccountHasNoRole':
            return `Address ${args?.[0]} is not a whitelisted participant`
        case 'TaskExists':
            return `Payment task already exists`

        // PBMVault Errors
        case 'InvalidDepositIdRange':
            return 'Payment/Deposit ID is out of range'
        case 'InvalidActiveDeposit':
            return 'Invalid active deposit'
        case 'DepositNotMatured':
            return `One or more deposits have not matured`
        case 'DepositAlreadyMatured':
            return 'Payment has already matured beyond its holding period'
        case 'InvalidTransfer':
            return 'Vaulted PBM tokens cannot be transferred'
        default:
            return error
    }
}
