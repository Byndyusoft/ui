import React, { FC, HTMLAttributes } from 'react';
import cn from 'classnames';

export interface IModalBodyProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
}

const ModalBody: FC<IModalBodyProps> = ({ className, children, ...props }) => (
    <div className={cn('ModalBody', className)} {...props}>{children}</div>
);

export default ModalBody;
