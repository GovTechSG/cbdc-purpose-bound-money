import moment from 'moment/moment'
import { PaymentData } from '@app/hooks/use-fetch-payment-data'
import { PaymentStatus } from '@app/common/enums'
import { Block } from '@ethersproject/abstract-provider'
import { PaymentDataSource } from '@app/utils/payments/types'

/**
 * Immediate
 * - Transfer from 0x0 address
 * - To address is not contract address
 * - No Deposit event in transaction
 *
 * Refunded
 * - Transfer from 0x0 address
 * - Has Deposit event in transaction
 * - Has Withdrawal event indexed by depositId with matured flag false
 *
 * Matured
 * - Transfer from 0x0 address
 * - Has Deposit event in transaction
 * - No Withdrawal event indexed by depositId
 * - redeemTimestamp in Deposit event <= current timestamp
 *
 * Withheld
 * - Transfer from 0x0 address
 * - Has Deposit event in transaction
 * - No Withdrawal event indexed by depositId
 * - redeemTimestamp in Deposit event > current timestamp
 *
 * Withdrawn
 * - Transfer from 0x0 address
 * - Has Deposit event in transaction
 * - Has Withdrawal event indexed by depositId with matured flag true
 */

export const getPaymentDataSource = (
    paymentData: PaymentData[],
    latestBlock: Block
): PaymentDataSource[] => {
    return paymentData.map((data, key) => {
        const {
            transactionHash,
            fromAddress,
            toAddress,
            transferDt: sentDateTime,
            amount,
            depositEvent,
            withdrawalEvent,
            depositId,
        } = data

        const statuses = []
        let remainingHoldingPeriod = 0
        if (!depositEvent) {
            statuses.push(PaymentStatus.Immediate)
        } else {
            if (!withdrawalEvent) {
                const redeemTimestamp = moment.unix(depositEvent.args.redeemTimestamp.toNumber())
                const currentTimestamp = moment.unix(latestBlock.timestamp)
                if (redeemTimestamp.isAfter(currentTimestamp)) {
                    // Withheld
                    statuses.push(PaymentStatus.Withheld)
                    remainingHoldingPeriod = redeemTimestamp.diff(currentTimestamp, 'seconds')
                } else {
                    // Matured
                    statuses.push(PaymentStatus.Matured)
                }
            } else {
                if (withdrawalEvent.args.matured) {
                    // Withdrawn
                    statuses.push(PaymentStatus.Withdrawn)
                } else {
                    // Refunded
                    statuses.push(PaymentStatus.Refunded)
                }
            }
        }

        return {
            key,
            transactionHash,
            fromAddress,
            toAddress,
            sentDateTime,
            amount,
            statuses,
            remainingHoldingPeriod,
            depositId,
        }
    })
}
