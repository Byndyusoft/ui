import React, { FC } from 'react';
import ModalContainer from './ModalContainer';
import ModalCloseButton from './ModalCloseButton';
import './Modal.css';

export interface IModalProps {
    className?: string;
    id: string;
}

const Modal: FC<IModalProps> = ({ className, children, id }) => (
    <ModalContainer className={className} modalId={id}>
        <ModalCloseButton modalId={id}>X</ModalCloseButton>
        { children }
    </ModalContainer>
);

export default Modal;
