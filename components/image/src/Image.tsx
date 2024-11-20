import React, { forwardRef, ReactElement, useImperativeHandle, useRef } from 'react';
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

    const renderImage = (src: string): JSX.Element => (
        <img ref={setRefs} className={className} src={src} alt={alt} {...otherProps} />
    );

    const renderFallback = (content: ReactElement): JSX.Element => (
        <div ref={setRefs} className={fallbackClassName}>
            {content}
        </div>
    );

    if (fallback && isLoading) return renderFallback(fallback);

    if (fallbackSrc && isLoading) return renderImage(fallbackSrc);

    if (errorFallback && isError) return renderFallback(errorFallback);

    if (errorFallbackSrc && isError) return renderImage(errorFallbackSrc);

    return renderImage(src);
});

export default Image;
