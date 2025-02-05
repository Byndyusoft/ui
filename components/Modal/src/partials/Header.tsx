import React, { FC } from 'react';
import cn from 'classnames';
import { IModalPartialProps } from '../Modal.types';
import styles from '../Modal.module.css';

const ModalHeader: FC<IModalPartialProps> = ({ className, children, ...props }): JSX.Element => (
    <header className={cn(styles.header, className)} {...props}>
        {children}
    </header>
);

export default ModalHeader;
