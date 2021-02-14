import React, { FC } from 'react';
import cn from 'classnames';
import { useModalsManager } from './ModalsManager';

export interface IModalCloseButtonProps {
    className?: string;
    modalId: string
}

const ModalCloseButton: FC<IModalCloseButtonProps> = ({ className, children, modalId }) => {
    const { close } = useModalsManager();

    const handleClick = () => {
        console.log('Close modal with id: ', modalId);
        close(modalId);
    };

    return (
        <button type="button" className={cn('ModalCloseButton', className)} onClick={handleClick}>{children}</button>
    )
};

export default ModalCloseButton;
