import { HTMLAttributes } from 'react';

export interface IOverlayProps extends HTMLAttributes<HTMLDivElement> {
    isVisible?: boolean;
    color?: string;
    blur?: number;
    zIndex?: number;
    backgroundOpacity?: number;
    center?: boolean;
    classNames?: IOverlayClassNames;
}

export interface IOverlayClassNames {
    container?: string;
    fadeIn?: string;
    fadeOut?: string;
    center?: string;
}
