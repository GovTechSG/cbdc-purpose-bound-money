import React from 'react'
import { BigNumber } from 'ethers'
import moment from 'moment/moment'
import { PaymentStatus } from '@app/common/enums'

export interface PaymentDataSource {
    key: React.Key
    transactionHash: string
    fromAddress: string
    toAddress: string
    amount: BigNumber
    remainingHoldingPeriod: number
    sentDateTime: moment.Moment
    statuses: PaymentStatus[]
    depositId?: BigNumber
}

export type PaymentDataSourceKey = keyof PaymentDataSource
