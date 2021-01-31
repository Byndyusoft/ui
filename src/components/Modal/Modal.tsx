import React, { FC } from 'react';
import ModalContainer from './ModalContainer';
import ModalCloseButton from './ModalCloseButton';

export interface IModalProps {
    className?: string;
}

const Modal: FC<IModalProps> = ({ className, children }) => (
    <ModalContainer className={className}>
        <ModalCloseButton />
        { children }
    </ModalContainer>
);

export default Modal;
