import { Dispatch, ImgHTMLAttributes, ReactElement, SetStateAction } from 'react';
import { Callback } from '@byndyusoft-ui/types';
import { IUseIntersectionObserverOptions } from '@byndyusoft-ui/use-intersection-observer';

export interface IImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    className?: string;
    rootFallbackClassName?: string;
    rootErrorFallbackClassName?: string;
    fallback?: ReactElement;
    fallbackSrc?: string;
    errorFallback?: ReactElement;
    errorFallbackSrc?: string;
    lazy?: boolean;
    intersectionObserverSettings?: IUseIntersectionObserverOptions;
}

type TSetState<T> = Dispatch<SetStateAction<T>>;

export interface IUseImageProps {
    src: string;
    lazy?: boolean;
    intersectionObserverSettings?: IUseIntersectionObserverOptions;
}

export interface IUseImageReturn {
    setObserverTargetRef: TSetState<Element | null>;
    isLoading: boolean;
    isError: boolean;
}

export type TLoadImageFunction = Callback<
    [src: string, setIsLoading: TSetState<boolean>, setIsError: TSetState<boolean>]
>;
