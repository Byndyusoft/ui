import React, { FC, HTMLAttributes } from 'react';
import cn from 'classnames';

export interface IModalHeaderProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
}

const ModalHeader: FC<IModalHeaderProps> = ({ className, children, ...props }) => (
    <header className={cn('ModalHeader', className)} {...props}>{children}</header>
);

export default ModalHeader;
