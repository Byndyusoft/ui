import { Dispatch, ImgHTMLAttributes, ReactElement, SetStateAction } from 'react';
import { Callback } from '@byndyusoft-ui/types';

export interface IImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    className?: string;
    fallbackClassName?: string;
    fallback?: ReactElement;
    fallbackSrc?: string;
    errorFallback?: ReactElement;
    errorFallbackSrc?: string;
    lazy?: boolean;
}

type TSetState<T> = Dispatch<SetStateAction<T>>;

export interface IUseImageProps {
    src: string;
    lazy?: boolean;
}

export interface IUseImageReturn {
    setObserverTargetRef: TSetState<Element | null>;
    isLoading: boolean;
    isError: boolean;
}

export type TLoadImageFunction = Callback<
    [src: string, setIsLoading: TSetState<boolean>, setIsError: TSetState<boolean>]
>;
