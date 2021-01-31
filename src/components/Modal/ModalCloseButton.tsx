import React, { FC } from 'react';
import cn from 'classnames';

export interface IModalCloseButtonProps {
    className?: string;
}

const ModalCloseButton: FC<IModalCloseButtonProps> = ({ className, children }) => (
    <button type="button" className={cn('ModalCloseButton', className)}>{children}</button>
);

export default ModalCloseButton;
