import React, { forwardRef, ReactElement, useImperativeHandle, useRef } from 'react';
import { useImage } from './useImage';
import type { IImageProps } from './Image.types';

const Image = forwardRef<HTMLImageElement, IImageProps>((props, forwardedRef) => {
    const {
        src,
        alt = '',
        lazy = false,
        fallback,
        fallbackSrc,
        errorFallback,
        errorFallbackSrc,
        className,
        rootFallbackClassName,
        rootErrorFallbackClassName,
        intersectionObserverSettings,
        ...otherProps
    } = props;

    const internalRef = useRef<HTMLImageElement | null>(null);

    const { isLoading, isError, setObserverTargetRef } = useImage({
        src,
        lazy,
        intersectionObserverSettings
    });

    const setRefs = (node: HTMLImageElement | null): void => {
        internalRef.current = node;
        setObserverTargetRef(node);
    };

    const renderImage = (imageSrc: string): JSX.Element => (
        <img ref={setRefs} className={className} src={imageSrc} alt={alt} {...otherProps} />
    );

    const renderFallback = (content: ReactElement, rootClassName?: string): JSX.Element => (
        <div ref={setRefs} className={rootClassName}>
            {content}
        </div>
    );

    useImperativeHandle(forwardedRef, () => internalRef.current as HTMLImageElement);

    if (fallback && isLoading) {
        return renderFallback(fallback, rootFallbackClassName);
    }

    if (errorFallback && isError) {
        return renderFallback(errorFallback, rootErrorFallbackClassName);
    }

    if (fallbackSrc && isLoading) return renderImage(fallbackSrc);

    if (errorFallbackSrc && isError) return renderImage(errorFallbackSrc);

    return renderImage(src);
});

Image.displayName = 'Image';

export default Image;
