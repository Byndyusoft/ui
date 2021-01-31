import React, { FC } from 'react';
import cn from 'classnames';

export interface IModalCloseButtonProps {
    className?: string;
    modalId: string
}

const ModalCloseButton: FC<IModalCloseButtonProps> = ({ className, children, modalId }) => {
    const handleClick = () => {
        console.log('Close modal with id: ', modalId);
    };

    return (
        <button type="button" className={cn('ModalCloseButton', className)} onClick={handleClick}>{children}</button>
    )
};

export default ModalCloseButton;
