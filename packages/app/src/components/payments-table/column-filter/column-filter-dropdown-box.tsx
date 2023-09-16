import { FilterConfirmProps, FilterDropdownProps } from 'antd/es/table/interface'
import React from 'react'
import { Button, Input, InputRef, Space } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

type FilterDropdownBoxProps = {
    placeholder: string
    searchInputRef: React.MutableRefObject<InputRef | null>
} & FilterDropdownProps

export const ColumnFilterDropdownBox = ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
    placeholder,
    searchInputRef,
}: FilterDropdownBoxProps) => {
    // const searchInput = useRef<InputRef>(null)

    const handleSearch = (
        selectedKeys: string[],
        confirm: (param?: FilterConfirmProps) => void
    ) => {
        confirm({ closeDropdown: true })
        console.log('=====selectedKeys', selectedKeys)
    }

    const handleReset = (
        clearFilters: () => void,
        confirm: (param?: FilterConfirmProps) => void
    ) => {
        clearFilters()
        confirm()
    }

    return (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
            <Input
                ref={searchInputRef}
                placeholder={placeholder}
                value={selectedKeys[0]}
                onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                onPressEnter={() => handleSearch(selectedKeys as string[], confirm)}
                style={{ marginBottom: 8, display: 'block' }}
            />
            <Space>
                <Button
                    type="primary"
                    onClick={() => handleSearch(selectedKeys as string[], confirm)}
                    icon={<SearchOutlined />}
                    size="small"
                    style={{ width: 90 }}
                >
                    Search
                </Button>
                <Button
                    onClick={() => clearFilters && confirm && handleReset(clearFilters, confirm)}
                    size="small"
                    style={{ width: 90 }}
                >
                    Reset
                </Button>
            </Space>
        </div>
    )
}
