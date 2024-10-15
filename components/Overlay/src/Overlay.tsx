import React, { FC, useEffect } from 'react';
import { css } from '@linaria/core';
import cn from 'classnames';
import { IOverlayProps } from './Overlay.types';
// import './Overlay.css';

export const overlayCss = css`
    color: red;
`;

const Overlay: FC<IOverlayProps> = ({
    children,
    className,
    isVisible,
    color,
    blur,
    backgroundOpacity = 0.6,
    zIndex,
    center,
    ...props
}): JSX.Element => {
    useEffect(() => {
        if (isVisible) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [isVisible]);

    return (
        <>
            <div
                className={cn('bs-overlay', overlayCss, isVisible && 'is-visible', center && 'center')}
                role="presentation"
                tabIndex={-1}
                {...props}
            >
                {children && <div className={className}>{children}</div>}
            </div>
        </>
    );
};

export default Overlay;
