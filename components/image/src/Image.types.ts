import { ImgHTMLAttributes, ReactElement } from 'react';

export interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    className?: string;
    fallback?: ReactElement;
    fallbackUrl?: string;
    errorFallback?: ReactElement;
    lazy?: boolean;
}
