import React, { forwardRef } from 'react'
import { useAccountAccessContext } from '@app/contexts/account-access-context'
import { Button, Space, Table, Tag, Tooltip } from 'antd'
import { getColumnFilterProps } from '@app/components/payments-table/column-filter/get-column-filter-props'
import { BigNumber } from 'ethers'
import { formatNumberDisplay } from '@app/utils/helpers'
import { formatUnits } from 'ethers/lib/utils'
import { PaymentDataSource } from '@app/utils/payments/types'
import moment from 'moment'
import { PaymentStatus } from '@app/common/enums'
import { PaymentsTable, PaymentsTableForwardedRef } from '@app/components/payments-table'
import { BlockExplorer } from '@app/components/block-explorer'
import { addressLabelRenderer } from '@app/components/payments-table/address-label-renderer'

const { Column } = Table

interface PaymentsReceivedTableProps extends React.ComponentProps<typeof PaymentsTable> {}

const canRecall = (statuses: PaymentStatus[]) => statuses.includes(PaymentStatus.Withheld)

export const PaymentsReceivedTable = forwardRef<
    PaymentsTableForwardedRef,
    PaymentsReceivedTableProps
>(function PaymentsReceivedTable(props, ref) {
    const { decimals, onChargeback } = props

    const { isConnectedPayee } = useAccountAccessContext()

    return (
        <PaymentsTable ref={ref} {...props}>
            {({ searchInput, filteredInfo }) => (
                <>
                    <Column
                        title="Transaction ID"
                        dataIndex="transactionHash"
                        key="transactionHash"
                        width={180}
                        ellipsis={{ showTitle: false }}
                        render={(val) => (
                            <Tooltip title={val} placement="bottomLeft">
                                <BlockExplorer.TransactionLink hash={val}>
                                    {val}
                                </BlockExplorer.TransactionLink>
                            </Tooltip>
                        )}
                        {...getColumnFilterProps(
                            'Filter by transaction ID',
                            'transactionHash',
                            searchInput
                        )}
                        filteredValue={filteredInfo.transactionHash || null}
                    />
                    <Column
                        title="Sender Address"
                        dataIndex="fromAddress"
                        key="fromAddress"
                        ellipsis={{ showTitle: false }}
                        {...getColumnFilterProps(
                            'Filter by from address',
                            'fromAddress',
                            searchInput
                        )}
                        filteredValue={filteredInfo.fromAddress || null}
                        render={addressLabelRenderer}
                    />
                    <Column
                        title="Recipient Address (You)"
                        dataIndex="toAddress"
                        key="toAddress"
                        ellipsis={{ showTitle: false }}
                        render={addressLabelRenderer}
                    />
                    <Column
                        title="Amount Received (PBM)"
                        dataIndex="amount"
                        key="amount"
                        width={160}
                        render={(val: BigNumber) => (
                            <Tooltip
                                title={`${formatNumberDisplay(
                                    formatUnits(val, decimals),
                                    decimals
                                )} PBM`}
                                placement="bottom"
                            >
                                {formatNumberDisplay(formatUnits(val, decimals))}
                            </Tooltip>
                        )}
                        sorter={(a: PaymentDataSource, b: PaymentDataSource) => {
                            if (a.amount.lt(b.amount)) return -1
                            if (a.amount.eq(b.amount)) return 0
                            return 1
                        }}
                        align="center"
                    />
                    <Column
                        title="Remaining Period"
                        dataIndex="remainingHoldingPeriod"
                        key="remainingHoldingPeriod"
                        width={130}
                        render={(val) =>
                            val === 0 ? 'None' : moment.duration(val, 'seconds').humanize()
                        }
                        sorter={(a: PaymentDataSource, b: PaymentDataSource) =>
                            a.remainingHoldingPeriod - b.remainingHoldingPeriod
                        }
                        align="center"
                    />
                    <Column
                        title="Received Date/Time"
                        dataIndex="sentDateTime"
                        key="sentDateTime"
                        width={130}
                        render={(val: moment.Moment) =>
                            `${val.utcOffset(8).format('DD/MM/YYYY HH:mm:ss')} SGT`
                        }
                        defaultSortOrder="descend"
                        sorter={(a: PaymentDataSource, b: PaymentDataSource) => {
                            if (a.sentDateTime.isBefore(b.sentDateTime)) return -1
                            if (a.sentDateTime.isSame(b.sentDateTime)) return 0
                            return 1
                        }}
                    />
                    <Column
                        title="Statuses"
                        dataIndex="statuses"
                        key="statuses"
                        width={150}
                        align="center"
                        filteredValue={filteredInfo.statuses || null}
                        filters={Object.values(PaymentStatus).map((status) => ({
                            text: status,
                            value: status,
                        }))}
                        onFilter={(value, record: PaymentDataSource) =>
                            record.statuses.includes(value as PaymentStatus)
                        }
                        render={(tags: string[]) => (
                            <>
                                {tags.map((tag) => (
                                    <Tag color="blue" key={tag}>
                                        {tag}
                                    </Tag>
                                ))}
                            </>
                        )}
                    />
                    <Column
                        title="Action"
                        key="action"
                        fixed="right"
                        width={100}
                        align="center"
                        render={(_: any, record: PaymentDataSource) => (
                            <Space size="middle">
                                <Button
                                    type="link"
                                    size="small"
                                    disabled={!canRecall(record.statuses) || !isConnectedPayee}
                                    onClick={() => onChargeback(record)}
                                >
                                    Refund
                                </Button>
                            </Space>
                        )}
                    />
                </>
            )}
        </PaymentsTable>
    )
})
