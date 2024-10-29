import React, { FC, forwardRef, useEffect } from 'react';
import cn from 'classnames';
import { IOverlayProps } from './Overlay.types';
import styles from './Overlay.module.css';
import hexToRgba from './utilities/hexToRgba';

const Overlay = forwardRef<HTMLDivElement, IOverlayProps>(
    (
        { children, className, isVisible, color, blur, backgroundOpacity = 0.6, zIndex, center, ...props },
        ref
    ): JSX.Element => {
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
                    className={cn(styles.container, isVisible && styles.isVisible, center && styles.center)}
                    style={{
                        zIndex: zIndex ? zIndex : 0,
                        backgroundColor: color ? hexToRgba(color, backgroundOpacity) : '',
                        backdropFilter: blur ? `blur(${blur}px)` : ''
                    }}
                    role="presentation"
                    ref={ref}
                    tabIndex={-1}
                    {...props}
                >
                    {children && <div className={className}>{children}</div>}
                </div>
            </>
        );
    }
);

export default Overlay;
