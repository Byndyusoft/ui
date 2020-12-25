import React, { FC } from 'react';
import cn from 'classnames';

interface ISkeletonProps {
    className?: string;
    duration?: number;
    baseColor?: string;
    highlightColor?: string;
}

export const defaultBaseColor = '#a2a2a2';

export const defaultHighlightColor = '#a7a7a7';

const Skeleton: FC<ISkeletonProps> = ({
    className,
    children,
    duration = 2,
    baseColor = defaultBaseColor,
    highlightColor = defaultHighlightColor
}) => {
    const skeletonStyles = {
        backgroundColor: baseColor,
        backgroundImage: `linear-gradient(
        90deg,
        ${baseColor},
        ${highlightColor},
        ${baseColor})`,
        animation: `skeleton-animation-blink ${duration}s ease-in-out infinite`,
        // backgroundSize: '200px 100%',
        backgroundRepeat: 'no-repeat'
    };

    return (
        <div className={cn(className, 'Skeleton')} style={skeletonStyles}>
            {children}
        </div>
    );
};

export default Skeleton;
