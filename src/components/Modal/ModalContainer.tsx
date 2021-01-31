import React, { FC } from 'react';
import cn from 'classnames';

export interface IModalContainerProps {
    className?: string;
}

const ModalContainer: FC<IModalContainerProps> = ({ className, children }) => (
    <section className={cn('ModalContainer', className)}>{children}</section>
);

export default ModalContainer;
