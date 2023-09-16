import styled from '@emotion/styled'
import React from 'react'
import { AllocationLegendColourBox } from '@app/components/token-overview/pbm-overview-card/allocation-legend-indicator'

const StatisticTitleContainer = styled.div`
    display: flex;
    align-items: center;
`

export const StatisticTitle: React.FC<
    React.PropsWithChildren<{
        colour: React.ComponentProps<typeof AllocationLegendColourBox>['colour']
    }>
> = ({ colour, children }) => (
    <StatisticTitleContainer>
        <AllocationLegendColourBox colour={colour} />
        <span>{children}</span>
    </StatisticTitleContainer>
)
