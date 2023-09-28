import { StatisticTitle } from '@app/components/token-overview/pbm-overview-card/statistic-title'
import { Skeleton, Statistic, Typography } from 'antd'
import React from 'react'

const { Text } = Typography

interface StatisticWithLoaderProps {
    loading: boolean
    title: React.ReactNode
    legendColour: `#${string}`
    value: React.ComponentProps<typeof Statistic>['value']
}

export const StatisticTitleWithLoader: React.FC<StatisticWithLoaderProps> = ({
    title,
    legendColour,
    loading,
    value,
}) => {
    const statisticTitle = <StatisticTitle colour={legendColour}>{title}</StatisticTitle>

    return value?.toString() && !loading ? (
        <Statistic title={statisticTitle} value={value} precision={4} />
    ) : (
        <div>
            <Text type="secondary">{statisticTitle}</Text>
            <Skeleton.Input active={true} size="large" />
        </div>
    )
}
