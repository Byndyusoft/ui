import React, { FC } from 'react';
import cn from 'classnames';
import { IModalPartialProps } from '../Modal.types';

const ModalHeader: FC<IModalPartialProps> = ({ className, children, ...props }): JSX.Element => (
    <header className={cn('bs-modal__header', className)} {...props}>
        {children}
    </header>
);

export default ModalHeader;
