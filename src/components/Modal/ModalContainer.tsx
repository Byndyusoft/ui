import React, { FC, HTMLAttributes } from 'react';
import cn from 'classnames';
import Overlay from '../Overlay';

export interface IModalContainerProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
}

const ModalContainer: FC<IModalContainerProps> = ({ className, children, ...props }) => (
    <Overlay isOpen>
        <section className={cn('ModalContainer', className)} {...props} role="dialog" tabIndex={-1}>
            {children}
        </section>
    </Overlay>
);

export default ModalContainer;
