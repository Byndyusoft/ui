import React, { FC, HTMLAttributes } from 'react';
import cn from 'classnames';

export interface IModalFooterProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
}

const ModalFooter: FC<IModalFooterProps> = ({ className, children, ...props }) => (
    <footer className={cn('ModalFooter', className)} {...props}>{children}</footer>
);

export default ModalFooter;
