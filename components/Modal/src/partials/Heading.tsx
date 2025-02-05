import { createElement, FC } from 'react';
import cn from 'classnames';
import { THeadingTag } from '../Modal.types';
import styles from '../Modal.module.css';

interface IModalHeadingProps {
    className?: string;
    as?: THeadingTag;
    children: string | JSX.Element;
}

const ModalHeading: FC<IModalHeadingProps> = ({ as = 'h3', children, className, ...props }) =>
    createElement(as, { className: cn(styles.heading, className), ...props }, children);

export default ModalHeading;
