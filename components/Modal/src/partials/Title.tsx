import { createElement, FC } from 'react';
import cn from 'classnames';
import { IModalTitleProps } from '../Modal.types';
import styles from '../Modal.module.css';

const ModalTitle: FC<IModalTitleProps> = ({ className, children, as = 'h2', ...props }): JSX.Element =>
    createElement(as, { className: cn(styles.title, className), ...props }, children);

export default ModalTitle;
