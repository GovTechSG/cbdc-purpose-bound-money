import styled from '@emotion/styled'
import { Typography } from 'antd'

interface AllocationLegendColourBoxProps {
    colour: `#${string}`
}

interface AllocationLegendIndicatorProps
    extends React.PropsWithChildren,
        AllocationLegendColourBoxProps {
    title: string
}

export const AllocationLegendColourBox = styled.span<AllocationLegendColourBoxProps>`
    display: inline-block;
    width: 0.8rem;
    height: 0.8rem;
    margin-right: 0.3rem;
    background-color: ${({ colour }) => colour};
`

const AllocationLegendIndicatorContainer = styled.span`
    display: flex;
    align-items: center;

    & .title {
        font-size: smaller;
    }
`

export const AllocationLegendIndicator: React.FC<AllocationLegendIndicatorProps> = ({
    colour,
    title,
}) => (
    <AllocationLegendIndicatorContainer>
        <AllocationLegendColourBox colour={colour} />
        <Typography.Text type="secondary" className="title">
            {title}
        </Typography.Text>
    </AllocationLegendIndicatorContainer>
)
