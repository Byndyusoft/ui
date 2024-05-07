import { createElement, FC } from 'react';
import { THeadingTag } from '../Modal.types';

interface IModalHeadingProps {
    className?: string;
    as?: THeadingTag;
    children: string | JSX.Element;
}

const ModalHeading: FC<IModalHeadingProps> = ({ as = 'h3', children, ...props }) =>
    createElement(as, { className: 'bs-modal__heading', ...props }, children);

export default ModalHeading;
