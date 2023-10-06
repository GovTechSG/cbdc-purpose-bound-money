'use client'

import { AddressBookLabelWithTooltip } from '@app/components/address-book-label-with-tooltip'
import { useAppLayoutContext } from '@app/components/app-layout'
import { PaymentForm } from '@app/components/payment-form'
import { useAssetTokenContext } from '@app/contexts/asset-token-context'
import { usePBMTokenContext } from '@app/contexts/pbm-token-context'
import { useTransactionModal } from '@app/contexts/transaction-modal-context'
import { formatNumberDisplay, isAutomationEnabled } from '@app/utils/helpers'
import { withWalletConnected } from '@app/utils/with-wallet-connected'
import { constants, Signer } from 'ethers'
import { parseUnits } from 'ethers/lib/utils'
import React, { ElementRef, useRef } from 'react'
import { useSigner } from 'wagmi'

function SendPage() {
    useAppLayoutContext({ pageHeading: 'Wrap and Send Payment' })

    const { data: signer } = useSigner()
    const { contract: pbmContract, decimals, symbol: pbmSymbol } = usePBMTokenContext()
    const { contract: assetContract, symbol: assetSymbol } = useAssetTokenContext()

    const paymentForm = useRef<ElementRef<typeof PaymentForm>>(null)
    const { open } = useTransactionModal()

    const paymentFormSubmitHandler = async (values: any) => {
        if (!pbmContract || !signer) return
        const action = () =>
            pbmContract
                .connect(signer as Signer)
                .pay(
                    values.payee,
                    parseUnits(values.inputAmount.baseAmount, decimals),
                    Number(values.lockPeriod) * 86400,
                    isAutomationEnabled()
                )
        const modalDetails = await formatModalDetails({
            formValues: values,
            signer: signer as Signer,
            decimals,
        })
        open(action, modalDetails)
    }

    const assetApprovalHandler = async () => {
        return new Promise<void>(async (resolve, reject) => {
            if (!pbmContract || !assetContract || !signer) return
            const action = () =>
                assetContract
                    .connect(signer as Signer)
                    .approve(pbmContract.address, constants.MaxUint256)
            const modalDetails = await formatApprovalModalDetails({
                signer,
                pbmSymbol,
                assetSymbol,
                spender: pbmContract.address,
            })
            open(action, modalDetails, (error) => (!error ? resolve() : reject(error)))
        })
    }

    return (
        <div>
            <PaymentForm
                ref={paymentForm}
                onApproval={assetApprovalHandler}
                onSubmit={paymentFormSubmitHandler}
            />
        </div>
    )
}

const formatModalDetails = async ({
    formValues,
    signer,
    decimals,
}: {
    formValues: Record<string, any>
    signer: Signer
    decimals: number
}) => {
    const { baseAmount, baseCurrency } = formValues.inputAmount
    const from = await signer.getAddress()

    return {
        Action: 'Wrap and Send Payment',
        'From Address': <AddressBookLabelWithTooltip address={from} />,
        'To Address': <AddressBookLabelWithTooltip address={formValues.payee} />,
        Amount: `${baseCurrency.toUpperCase()}$ ${formatNumberDisplay(baseAmount, decimals)}`,
        'Holding Period': `${formValues.lockPeriod} Days`,
    }
}

const formatApprovalModalDetails = async ({
    signer,
    spender,
    pbmSymbol,
    assetSymbol,
}: {
    signer: Signer
    spender: string
    pbmSymbol: string
    assetSymbol: string
}) => {
    const from = await signer.getAddress()
    return {
        Action: `Approve ${assetSymbol} for Spending by ${pbmSymbol}`,
        'Approver Address': <AddressBookLabelWithTooltip address={from} />,
        'Spender Address': <AddressBookLabelWithTooltip address={spender} />,
    }
}

export default withWalletConnected(SendPage)
