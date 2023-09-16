import { Skeleton } from 'antd'
import React from 'react'

interface SkeletonInputLoaderProps
    extends React.PropsWithChildren,
        React.ComponentProps<typeof Skeleton.Input> {
    loading: boolean
    size?: React.ComponentProps<typeof Skeleton.Input>['size']
}

const Input: React.FC<SkeletonInputLoaderProps> = ({ children, loading, size, ...rest }) => {
    return loading ? (
        <Skeleton.Input active={true} size={size ?? 'small'} {...rest} />
    ) : (
        <>{children}</>
    )
}

export const SkeletonLoader = {
    Input,
}
