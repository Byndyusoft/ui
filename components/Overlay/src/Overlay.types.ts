import { HTMLAttributes } from 'react';

export interface IOverlayProps extends HTMLAttributes<HTMLDivElement> {
    classNames?: IOverlayClassNames;
    refElement?: HTMLElement | null;
    color?: string;
    backgroundOpacity?: number;
    blur?: number;
    zIndex?: number;
    isVisible?: boolean;
    center?: boolean;
    fixed?: boolean;
}

export interface IOverlayClassNames {
    container?: string;
    fadeIn?: string;
    fadeOut?: string;
    center?: string;
}
