import React, { useCallback } from 'react';
import cn from 'classnames';
import { useModals } from '@byndyusoft-ui/modals-provider';
import { IModalCloseButtonProps } from '../../Modal.types';
import styles from '../../Modal.module.css';

const ModalCloseButton = ({ className, id, title = 'Close', ...props }: IModalCloseButtonProps): JSX.Element => {
    const { close } = useModals();

    const handleClick = useCallback(() => close(id), [close, id]);

    return (
        <button type="button" className={cn(styles.close, className)} {...props} onClick={handleClick}>
            <span className={styles.closeText}>{title}</span>
        </button>
    );
};

export default ModalCloseButton;
