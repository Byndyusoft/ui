import React, { FC, HTMLAttributes } from 'react';
import cn from 'classnames';
import Overlay from '../Overlay';
import { TModalId, useModalsManager } from './ModalsManager';

export interface IModalContainerProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
    modalId: TModalId;
}

const ModalContainer: FC<IModalContainerProps> = ({ className, children, modalId, ...props }) => {
    const { isOpen } = useModalsManager();

    return (
        <Overlay isOpen={isOpen(modalId)}>
            <section className={cn('ModalContainer', className)} {...props} role="dialog" tabIndex={-1}>
                {children}
            </section>
        </Overlay>
    );
};

export default ModalContainer;
