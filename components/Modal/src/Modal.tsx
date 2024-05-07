import React, { FC } from 'react';
import { ModalContainer, ModalCloseButton } from './partials';
import { IModalProps } from './Modal.types';
import './Modal.css';

const Modal: FC<IModalProps> = ({ children, id, ...props }): JSX.Element => (
    <ModalContainer {...props} id={id}>
        {children}
        <ModalCloseButton id={id} />
    </ModalContainer>
);

export default Modal;
