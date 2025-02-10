import React, { forwardRef } from 'react';
import cn from 'classnames';
import { useScrollLock } from '@byndyusoft-ui/use-scroll-lock';
import { getDefaultOverlayClassNames, hexToRgba } from './utilities';
import { IOverlayProps } from './Overlay.types';

const Overlay = forwardRef<HTMLDivElement, IOverlayProps>(
    (
        {
            children,
            className,
            classNames,
            refElement,
            color = '#000000',
            backgroundOpacity = 0.6,
            blur = 10,
            zIndex = 100,
            isVisible = false,
            center = false,
            fixed = false,
            ...props
        },
        ref
    ): JSX.Element => {
        useScrollLock(isVisible, refElement);
        const mergedClassNames = Object.assign(getDefaultOverlayClassNames(), classNames);

        return (
            <div
                className={cn(
                    mergedClassNames.container,
                    isVisible ? mergedClassNames.fadeIn : mergedClassNames.fadeOut,
                    center && mergedClassNames.center,
                    className
                )}
                style={{
                    zIndex,
                    backgroundColor: hexToRgba(color, backgroundOpacity),
                    backdropFilter: `blur(${blur}px)`,
                    position: fixed ? 'fixed' : 'absolute'
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

Overlay.displayName = 'Overlay';

export default Overlay;
