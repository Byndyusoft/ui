import React, { FC } from 'react'
import cn from 'classnames';
import '@byndyusoft-ui/styles/Skeleton/Skeleton.css';

interface ISkeletonProps {
    className?: string
}

const Skeleton: FC<ISkeletonProps> = ({className, children}) => {
    return (
        <div className={cn(className, 'Skeleton')}>
            {children}
        </div>
    )
}

export default Skeleton
