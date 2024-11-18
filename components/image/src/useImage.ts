import { useLayoutEffect, useState } from 'react';
import useIntersectionObserver from '@byndyusoft-ui/use-intersection-observer';

interface IUseImageProps {
    src: string;
    lazy?: boolean;
}

const loadImage = (src: string, setIsLoading: (loading: boolean) => void, setIsError: (error: boolean) => void) => {
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

export default function useImage({ src, lazy }: IUseImageProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const [setObserverTargetRef] = useIntersectionObserver({
        skip: !lazy,
        triggerOnce: true,
        rootMargin: '20px',
        threshold: 0,
        onChange: isIntersecting => {
            if (lazy && isIntersecting) {
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
}
