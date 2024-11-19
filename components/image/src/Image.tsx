import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { useImage } from './useImage';
import type { IImageProps } from './Image.types';

const Image = forwardRef<HTMLImageElement, IImageProps>((props, forwardedRef) => {
    const {
        src,
        alt = '',
        lazy = true,
        fallback,
        fallbackSrc,
        errorFallback,
        errorFallbackSrc,
        className,
        fallbackClassName,
        ...otherProps
    } = props;

    const internalRef = useRef<HTMLImageElement | null>(null);

    const { isLoading, isError, setObserverTargetRef } = useImage({ src, lazy });

    useImperativeHandle(forwardedRef, () => internalRef.current as HTMLImageElement);

    const setRefs = (node: HTMLImageElement | null) => {
        internalRef.current = node;
        setObserverTargetRef(node);
    };

    if (fallback && isLoading) {
        return (
            <div ref={setRefs} className={fallbackClassName}>
                {fallback}
            </div>
        );
    }

    if (fallbackSrc && isLoading) {
        return <img ref={setRefs} className={className} src={fallbackSrc} alt={alt} {...otherProps} />;
    }

    if (errorFallback && isError) {
        return (
            <div ref={setRefs} className={fallbackClassName}>
                {errorFallback}
            </div>
        );
    }

    if (errorFallbackSrc && isError) {
        return <img ref={setRefs} className={className} src={errorFallbackSrc} alt={alt} {...otherProps} />;
    }

    return <img ref={setRefs} className={className} src={src} alt={alt} {...otherProps} />;
});

export default Image;
