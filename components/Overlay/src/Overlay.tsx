import React, { FC, useEffect } from 'react';
import cn from 'classnames';
import { IOverlayProps } from './Overlay.types';
import './Overlay.css';

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

    const hexToRgba = (hex: string, opacity?: number) => {
        let r = parseInt(hex.substring(1, 3), 16);
        let g = parseInt(hex.substring(3, 5), 16);
        let b = parseInt(hex.substring(5, 7), 16);
        return `rgba(${r},${g},${b},${opacity || 0.6})`;
    };

    return (
        <>
            <div
                className={cn('bs-overlay', isVisible && 'is-visible', center && 'center')}
                style={{
                    zIndex: zIndex ? zIndex : 0,
                    backgroundColor: color ? hexToRgba(color, backgroundOpacity) : '',
                    backdropFilter: blur ? `blur(${blur}px)` : ''
                }}
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
