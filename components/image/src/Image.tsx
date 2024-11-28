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
        rootFallbackClassName,
        ...otherProps
    } = props;

    const internalRef = useRef<HTMLImageElement | null>(null);

    const { isLoading, isError, setObserverTargetRef } = useImage({ src, lazy });

    const setRefs = (node: HTMLImageElement | null): void => {
        internalRef.current = node;
        setObserverTargetRef(node);
    };

    const renderImage = (imageSrc: string): JSX.Element => (
        <img ref={setRefs} className={className} src={imageSrc} alt={alt} {...otherProps} />
    );

    const renderFallback = (content: ReactElement): JSX.Element => (
        <div ref={setRefs} className={rootFallbackClassName}>
            {content}
        </div>
    );

    useImperativeHandle(forwardedRef, () => internalRef.current as HTMLImageElement);

    if (fallback && isLoading) return renderFallback(fallback);

    if (errorFallback && isError) return renderFallback(errorFallback);

    if (fallbackSrc && isLoading) return renderImage(fallbackSrc);

    if (errorFallbackSrc && isError) return renderImage(errorFallbackSrc);

    return renderImage(src);
});

Image.displayName = 'Image';

export default Image;
