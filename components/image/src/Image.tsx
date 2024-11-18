import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import useImage from './useImage';
import { ImageProps } from './Image.types';

const Image = forwardRef<HTMLImageElement, ImageProps>((props, forwardedRef) => {
    const { className, src, alt = '', lazy = true, errorFallback, fallback, fallbackUrl, ...otherProps } = props;

    const internalRef = useRef<HTMLImageElement | null>(null);

    const { isLoading, isError, setObserverTargetRef } = useImage({ src, lazy });

    useImperativeHandle(forwardedRef, () => internalRef.current as HTMLImageElement);

    const setRefs = (node: HTMLImageElement | null) => {
        internalRef.current = node;
        setObserverTargetRef(node);
    };

    if (fallback && isLoading) {
        return <div ref={setRefs}>{fallback}</div>;
    }

    if (fallbackUrl && isLoading) {
        return <img ref={setRefs} className={className} src={fallbackUrl} alt={alt} {...otherProps} />;
    }

    if (errorFallback && isError) {
        return <div ref={setRefs}>{errorFallback}</div>;
    }

    return <img ref={setRefs} className={className} src={src} alt={alt} {...otherProps} />;
});

export default Image;
