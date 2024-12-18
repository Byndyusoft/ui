import React, { forwardRef } from 'react';
import cn from 'classnames';
import useBodyScrollLock from '@byndyusoft-ui/use-body-scroll-lock';
import { getDefaultOverlayClassNames, hexToRgba } from './utilities';
import { IOverlayProps } from './Overlay.types';

const Overlay = forwardRef<HTMLDivElement, IOverlayProps>(
    (
        {
            children,
            className,
            classNames = getDefaultOverlayClassNames(),
            isVisible = false,
            color,
            blur = 0,
            backgroundOpacity = 0.6,
            zIndex = 100,
            center = false,
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
                    zIndex: zIndex,
                    backgroundColor: color ? hexToRgba(color, backgroundOpacity) : '',
                    backdropFilter: blur ? `blur(${blur}px)` : ''
                }}
                role="presentation"
                ref={ref}
                tabIndex={-1}
                {...props}
            >
                {children && isVisible && children}
            </div>
        );
    }
);

export default Overlay;
