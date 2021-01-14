import React, { FC } from 'react';
import cn from 'classnames';
import './Skeleton.css';

interface ISkeletonProps {
    className?: string;
}

const Skeleton: FC<ISkeletonProps> = ({ className, children }) => <div className={cn(className, 'Skeleton')}>{children}</div>;

export default Skeleton;
