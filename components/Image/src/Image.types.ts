import { ImgHTMLAttributes, ReactElement } from 'react';

export interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
  fallback?: ReactElement;
  errorFallback?: ReactElement;
}
