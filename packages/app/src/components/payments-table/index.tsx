import { ethers } from 'ethers'
import { InputRef, Table, TableProps } from 'antd'
import { PaymentDataSource } from '@app/utils/payments/types'
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { FilterValue } from 'antd/es/table/interface'

interface PaymentsTableProps {
    latestBlock: ethers.providers.Block | undefined
    decimals: number
    dataSource: PaymentDataSource[]
    loading: boolean
    onChargeback: (paymentDataSource: PaymentDataSource) => Promise<void> | void
    children?: (props: {
        searchInput: React.RefObject<InputRef>
        filteredInfo: Record<string, FilterValue | null>
    }) => React.ReactNode
}

export type PaymentsTableForwardedRef = {
    clearFilters: () => void
}

export const PaymentsTable = forwardRef<PaymentsTableForwardedRef, PaymentsTableProps>(
    function PaymentsTable(
        { latestBlock, decimals, dataSource, loading, onChargeback, children },
        ref
    ) {
        const searchInput = useRef<InputRef>(null)
        const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({})

        useImperativeHandle(ref, () => ({
            clearFilters: () => setFilteredInfo({}),
        }))

        const tableChangeHandler: NonNullable<TableProps<PaymentDataSource>['onChange']> = (
            pagination,
            filters,
            _sorter
        ) => setFilteredInfo(filters)

        return (
            <>
                <Table
                    dataSource={dataSource}
                    style={{ minWidth: '100%' }}
                    scroll={{ x: '100%' }}
                    loading={loading}
                    onChange={tableChangeHandler}
                >
                    {typeof children === 'function' && children({ searchInput, filteredInfo })}
                </Table>
            </>
        )
    }
)
