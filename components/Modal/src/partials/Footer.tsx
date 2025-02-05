import React, { FC } from 'react';
import cn from 'classnames';
import { IModalPartialProps } from '../Modal.types';
import styles from '../Modal.module.css';

const ModalFooter: FC<IModalPartialProps> = ({ className, children, ...props }): JSX.Element => (
    <footer className={cn(styles.footer, className)} {...props}>
        {children}
    </footer>
);

export default ModalFooter;
