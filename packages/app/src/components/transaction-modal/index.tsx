'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Modal } from 'antd'
import { ContractTransaction } from 'ethers'
import { TransactionDetail } from '@app/components/transaction-modal/transaction-detail'
import { TransactionError } from '@app/components/transaction-modal/transaction-error'
import { TransactionProgress } from '@app/components/transaction-modal/transaction-progress'
import { TransactionModalContext } from '@app/contexts/transaction-modal-context'
import { TransactionSuccess } from '@app/components/transaction-modal/transaction-success'
import { parseTransactionError } from '@app/utils/errors/pbm-errors'

export type TransactionResultContentProps = {
    onActionClick?: () => Promise<void> | void
    setTitle: (title: string) => void
}

type TransactionAction = () => Promise<ContractTransaction>

type TransactionModalState = {
    showModal: boolean
    transactionHash?: string
    txError?: string
    confirmed: boolean
    completed: boolean
    action?: TransactionAction
    modalDetails: Record<any, any>
    callback?: (error?: Error) => void
}

type TransactionModalAction =
    | { type: 'reset' }
    | {
          type: 'showModal'
          action: TransactionAction
          modalDetails: Record<any, any>
          callback?: (error?: Error) => void
      }
    | { type: 'closeModal' }
    | { type: 'confirm' }
    | { type: 'updateTransactionHash'; hash: string }
    | { type: 'updateError'; error: string }
    | { type: 'updateCompleted' }

const initialState: TransactionModalState = {
    showModal: false,
    confirmed: false,
    completed: false,
    modalDetails: {},
    callback: undefined,
}

const transactionModalReducer = (state: TransactionModalState, action: TransactionModalAction) => {
    switch (action.type) {
        case 'reset':
            return { ...initialState, showModal: state.showModal }
        case 'showModal':
            return {
                ...state,
                showModal: true,
                action: action.action,
                modalDetails: action.modalDetails,
                callback: action.callback,
            }
        case 'closeModal':
            return { ...state, showModal: false }
        case 'confirm':
            return { ...state, confirmed: true }
        case 'updateTransactionHash':
            return { ...state, transactionHash: action.hash }
        case 'updateError':
            return { ...state, txError: action.error }
        case 'updateCompleted':
            return { ...state, completed: true }
        default:
            throw new Error('Invalid action type')
    }
}

type TransactionResultProps = {
    state: TransactionModalState
    setTitle: TransactionResultContentProps['setTitle']
    closeHandler: () => void
    confirmHandler: () => void
}

const TransactionResult: React.FC<TransactionResultProps> = ({
    state,
    setTitle,
    confirmHandler,
    closeHandler,
}) => {
    const { txError, confirmed, completed, transactionHash, modalDetails } = state
    // prettier-ignore
    if (txError) return <TransactionError error={txError} onActionClick={closeHandler} setTitle={setTitle}/>
    if (confirmed) {
        if (completed && transactionHash) {
            return <TransactionSuccess transactionHash={transactionHash} setTitle={setTitle} />
        }
        return <TransactionProgress setTitle={setTitle} transactionHash={transactionHash} />
    }

    return (
        <TransactionDetail
            onActionClick={confirmHandler}
            setTitle={setTitle}
            details={modalDetails}
        />
    )
}

export const TransactionModalProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [state, dispatch] = React.useReducer(transactionModalReducer, initialState)
    const [title, setTitle] = useState<string>('Sending Transaction...')

    const onDoneHandler = useRef<((success: boolean) => void) | undefined>()

    useEffect(() => {
        if (onDoneHandler.current && state.completed) {
            onDoneHandler.current(!state.txError)
        }
    }, [state.completed, state.txError])

    const setOnDoneHandler = (callback: (success: boolean) => void) => {
        onDoneHandler.current = callback
    }

    const open = (
        action: TransactionAction,
        modalDetails: Record<any, any>,
        callback?: (error?: Error) => void
    ) => {
        dispatch({ type: 'showModal', action, modalDetails, callback })
    }

    const closeHandler = () => {
        dispatch({ type: 'closeModal' })
    }

    const confirmHandler = async () => {
        try {
            if (!state.action) {
                // noinspection ExceptionCaughtLocallyJS
                throw new Error('No action provided')
            }
            dispatch({ type: 'confirm' })

            const tx = await state.action()
            dispatch({ type: 'updateTransactionHash', hash: tx.hash })

            await tx.wait()
            state.callback?.()
        } catch (e) {
            const errMessage = parseTransactionError(e)
            dispatch({ type: 'updateError', error: errMessage })
            console.error(e)
            state.callback?.(e as Error)
        } finally {
            dispatch({ type: 'updateCompleted' })
        }
    }

    const closable = !(state.confirmed && !state.completed && !state.txError)

    return (
        <TransactionModalContext.Provider value={{ open, setOnDoneHandler }}>
            {children}
            <Modal
                title={title}
                centered
                footer={null}
                width="auto"
                closable={closable}
                maskClosable={closable}
                open={state.showModal}
                onCancel={closeHandler}
                afterClose={() => dispatch({ type: 'reset' })}
            >
                <TransactionResult
                    state={state}
                    setTitle={setTitle}
                    closeHandler={closeHandler}
                    confirmHandler={confirmHandler}
                />
            </Modal>
        </TransactionModalContext.Provider>
    )
}
