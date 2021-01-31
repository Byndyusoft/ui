import React, { FC } from 'react';
import cn from 'classnames';

export interface IModalHeaderProps {
    className?: string;
}

const ModalHeader: FC<IModalHeaderProps> = ({ className, children }) => (
    <header className={cn('ModalHeader', className)}>{children}</header>
);

export default ModalHeader;
