import React, { FC, useEffect } from 'react';
import cn from 'classnames';
import { IOverlayProps } from './Overlay.types';
import './Overlay.css';

const Overlay: FC<IOverlayProps> = ({ children, className, isVisible, ...props }): JSX.Element => {
    useEffect(() => {
        if (isVisible) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [isVisible]);

    useEffect(
        () => () => {
            document.body.style.overflow = '';
        },
        []
    );

    return (
        <>
            <div className={cn('bs-overlay', isVisible && 'is-visible')} role="presentation" tabIndex={-1} {...props} />
            {isVisible && children && <div className={className}>{children}</div>}
        </>
    );
};

export default Overlay;
