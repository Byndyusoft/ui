import { createElement, FC } from 'react';
import cn from 'classnames';
import { IModalTitleProps } from '../Modal.types';

const ModalTitle: FC<IModalTitleProps> = ({ className, children, as = 'h2', ...props }): JSX.Element =>
    createElement(as, { className: cn('bs-modal__title', className), ...props }, children);

export default ModalTitle;
