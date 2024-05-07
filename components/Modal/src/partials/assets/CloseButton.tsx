import React, { useCallback } from 'react';
import cn from 'classnames';
import { useModals } from '@byndyusoft-ui/ModalsProvider';
import { IModalCloseButtonProps } from '../../Modal.types';

const ModalCloseButton = ({ className, id, title = 'Close', ...props }: IModalCloseButtonProps): JSX.Element => {
    const { close } = useModals();

    const handleClick = useCallback(() => close(id), [close, id]);

    return (
        <button type="button" className={cn('bs-modal__close', className)} {...props} onClick={handleClick}>
            <span className="bs-modal__close-text">{title}</span>
        </button>
    );
};

export default ModalCloseButton;
