import { useLayoutEffect, useState } from 'react';
import useIntersectionObserver from '@byndyusoft-ui/use-intersection-observer';
import { IUseImageProps, IUseImageReturn, TLoadImageFunction } from './Image.types';

const loadImage: TLoadImageFunction = (src, setIsLoading, setIsError) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
        setIsLoading(false);
    };
    img.onerror = () => {
        setIsLoading(false);
        setIsError(true);
    };
};

export const useImage = ({ src, lazy }: IUseImageProps): IUseImageReturn => {
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const [setObserverTargetRef] = useIntersectionObserver({
        skip: !lazy,
        triggerOnce: true,
        onChange: isIntersecting => {
            if (isIntersecting) {
                loadImage(src, setIsLoading, setIsError);
            }
        }
    });

    useLayoutEffect(() => {
        if (!lazy) {
            loadImage(src, setIsLoading, setIsError);
        }
    }, [src, lazy]);

    return {
        setObserverTargetRef,
        isLoading,
        isError
    };
};
