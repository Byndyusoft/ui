import React, { FC } from 'react';
import cn from 'classnames';
import { IModalPartialProps } from '../Modal.types';

const ModalFooter: FC<IModalPartialProps> = ({ className, children, ...props }): JSX.Element => (
    <footer className={cn('bs-modal__footer', className)} {...props}>
        {children}
    </footer>
);

export default ModalFooter;
