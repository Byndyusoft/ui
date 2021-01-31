import React, { FC } from 'react';
import cn from 'classnames';

export interface IModalBodyProps {
    className?: string;
}

const ModalBody: FC<IModalBodyProps> = ({ className, children }) => (
    <div className={cn('ModalBody', className)}>{children}</div>
);

export default ModalBody;
