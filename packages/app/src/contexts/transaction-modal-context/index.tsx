'use client'

import { createContext, useContext, useEffect } from 'react'
import { ContractTransaction } from 'ethers'

type TransactionModalContextProps = {
    open: (
        action: () => Promise<ContractTransaction>,
        modalDetails: Record<any, any>,
        callback?: (error?: Error) => void
    ) => void
    setOnDoneHandler: (onDoneHandler: (success: boolean) => void) => void
}

export const TransactionModalContext = createContext<TransactionModalContextProps>({
    open: () => {},
    setOnDoneHandler: () => {},
})

export const useTransactionModal = (onDoneHandler?: (success: boolean) => void) => {
    const context = useContext(TransactionModalContext)

    useEffect(() => {
        if (onDoneHandler) {
            context.setOnDoneHandler(onDoneHandler)
        }
    }, [context, onDoneHandler])

    return context
}
