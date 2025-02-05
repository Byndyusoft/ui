import React, { FC } from 'react';
import { ModalContainer, ModalCloseButton } from './partials';
import { IModalProps } from './Modal.types';
import styles from './Modal.module.css';

const Modal: FC<IModalProps> = ({ children, classNames, id, ...props }): JSX.Element => {
    const mergedClassNames = Object.assign(
        { container: styles.container, dialog: styles.dialog, overlay: styles.overlay, isOpen: styles.isOpen },
        classNames
    );

    return (
        <ModalContainer id={id} classNames={mergedClassNames} {...props}>
            {children}
            <ModalCloseButton id={id} />
        </ModalContainer>
    );
};

export default Modal;
