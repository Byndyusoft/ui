import React, { FC } from 'react';
import cn from 'classnames';

export interface IModalFooterProps {
    className?: string;
}

const ModalFooter: FC<IModalFooterProps> = ({ className, children }) => (
    <footer className={cn('ModalFooter', className)}>{children}</footer>
);

export default ModalFooter;
