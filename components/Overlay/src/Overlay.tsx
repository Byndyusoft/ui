import React, { FC, forwardRef, useEffect } from 'react';
import useBodyScrollLock from '@byndyusoft-ui/use-body-scroll-lock';
import cn from 'classnames';
import { getDefaultCheckBoxClassNames, hexToRgba } from './utilities';
import { IOverlayProps } from './Overlay.types';

const Overlay = forwardRef<HTMLDivElement, IOverlayProps>(
    (
        {
            children,
            className,
            classNames = getDefaultCheckBoxClassNames(),
            isVisible,
            color,
            blur,
            backgroundOpacity = 0.6,
            zIndex,
            center,
            ...props
        },
        ref
    ): JSX.Element => {
        useBodyScrollLock(isVisible);

        return (
            <div
                className={cn(
                    classNames.container,
                    isVisible && classNames.isVisible,
                    center && classNames.center,
                    className
                )}
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
                {children && children}
            </div>
        );
    }
);

export default Overlay;
