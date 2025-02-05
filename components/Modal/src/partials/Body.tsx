import React, { FC } from 'react';
import cn from 'classnames';
import { IModalPartialProps } from '../Modal.types';
import styles from '../Modal.module.css';

const ModalBody: FC<IModalPartialProps> = ({ className, children, ...props }): JSX.Element => (
    <div className={styles.body}>
        <article {...props} className={cn(styles.content, className)}>
            {children}
        </article>
    </div>
);

export default ModalBody;
