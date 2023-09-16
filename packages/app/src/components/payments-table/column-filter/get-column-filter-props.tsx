import { PaymentDataSource, PaymentDataSourceKey } from '@app/utils/payments/types'
import { ColumnType } from 'antd/es/table'
import { ColumnFilterDropdownBox } from '@app/components/payments-table/column-filter/column-filter-dropdown-box'
import { SearchOutlined } from '@ant-design/icons'
import { InputRef } from 'antd'
import React from 'react'

export const getColumnFilterProps = (
    placeHolderText: string,
    dataIndex: PaymentDataSourceKey,
    searchInput: React.RefObject<InputRef>
): ColumnType<PaymentDataSource> => ({
    filterDropdown: (filterDropdownProps) => (
        <ColumnFilterDropdownBox
            placeholder={placeHolderText}
            searchInputRef={searchInput}
            {...filterDropdownProps}
        />
    ),
    filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
        record[dataIndex]!.toString()
            .toLowerCase()
            .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
        if (visible) {
            setTimeout(() => searchInput.current?.select(), 100)
        }
    },
})
