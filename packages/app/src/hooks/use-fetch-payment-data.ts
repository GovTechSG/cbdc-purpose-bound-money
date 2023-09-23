import { usePBMTokenContext } from '@app/contexts/pbm-token-context'
import { PBM, PBMVault } from '@pbm/contracts'
import { DepositEvent, WithdrawalEvent } from '@pbm/contracts/dist/contracts/utils/PBMVault'
import { BigNumber } from 'ethers'
import moment from 'moment/moment'
import { useCallback, useEffect, useState } from 'react'

export type PaymentData = {
    transactionHash: string
    fromAddress: string
    toAddress: string
    transferDt: moment.Moment
    amount: BigNumber
    depositId?: BigNumber
    depositEvent?: DepositEvent
    withdrawalEvent?: WithdrawalEvent
}

const fetchPaymentData = async (
    pbmContract: PBM | undefined,
    pbmVaultContract: PBMVault | undefined,
    fromBlock: number,
    // TODO: Add pagination option
    opts?: { toBlock?: number; toAddress?: string | null }
) => {
    if (!pbmContract || !pbmVaultContract) return
    opts = {
        toAddress: null,
        ...opts,
    }
    const { toBlock, toAddress } = opts
    const paymentFilter = pbmContract.filters.Payment(null, toAddress)

    const paymentEvents = await pbmContract.queryFilter(
        paymentFilter,
        fromBlock,
        toBlock ?? 'latest'
    )
    return Promise.all(
        paymentEvents.map(async (transferEvent) => {
            const data: PaymentData = {
                transactionHash: transferEvent.transactionHash,
                fromAddress: '',
                toAddress: '',
                transferDt: moment(0),
                amount: BigNumber.from(0),
            }

            data.amount = transferEvent.args.amount

            const transferTxReceipt = await transferEvent.getTransactionReceipt()

            // Get transfer timestamp
            const block = await pbmContract.provider.getBlock(transferTxReceipt.blockNumber)
            data.transferDt = moment.unix(block.timestamp)

            const depositEvent = transferTxReceipt.logs
                .map((log) => {
                    try {
                        return pbmVaultContract.interface.parseLog(log)
                    } catch (_) {
                        return null
                    }
                })
                .find((log) => log && log.name === 'Deposit') as unknown as DepositEvent | undefined

            // If no deposit event, it's an immediate payment
            if (!depositEvent) {
                data.fromAddress = transferTxReceipt.from
                data.toAddress = transferEvent.args.payee
                return data
            }

            // Assign the payment data from deposit event
            data.fromAddress = depositEvent.args.depositor
            data.toAddress = depositEvent.args.recipient
            data.depositEvent = depositEvent
            data.depositId = depositEvent.args.depositId

            // Check for withdrawal event for the deposit
            const withdrawalFilter = pbmVaultContract.filters.Withdrawal(
                depositEvent.args.depositId
            )
            const withdrawalEvents = await pbmVaultContract.queryFilter(
                withdrawalFilter,
                depositEvent.blockNumber,
                toBlock
            )
            if (withdrawalEvents.length) {
                data.withdrawalEvent = withdrawalEvents[0]
            }
            return data
        })
    )
}

type useFetchPaymentDataParams = {
    toBlock?: number
    toAddress?: string
}

export const useFetchPaymentData = (params?: useFetchPaymentDataParams) => {
    const { toBlock, toAddress } = params || {}

    const [loading, setLoading] = useState(false)
    const [paymentData, setPaymentData] = useState<PaymentData[]>([])
    const {
        contract: pbmContract,
        vaultContract: pbmVaultContract,
        genesisBlock,
    } = usePBMTokenContext()

    const fetchPaymentDataCb = useCallback(async () => {
        setLoading(true)
        const data = await fetchPaymentData(pbmContract, pbmVaultContract, genesisBlock, {
            toBlock,
            toAddress,
        })
        setPaymentData(data || [])
        setLoading(false)
    }, [genesisBlock, pbmContract, pbmVaultContract, toAddress, toBlock])

    useEffect(() => {
        if (!pbmContract || !pbmVaultContract) return
        fetchPaymentDataCb()

        pbmContract
            .on('Payment', fetchPaymentDataCb)
            .on('Refund', fetchPaymentDataCb)
            .on('Redemption', fetchPaymentDataCb)
        pbmVaultContract.on('Withdrawal', fetchPaymentDataCb)

        return () => {
            pbmContract?.removeAllListeners()
            pbmVaultContract?.removeAllListeners()
        }
    }, [fetchPaymentDataCb, pbmContract, pbmVaultContract])

    return { paymentData, loading }
}
