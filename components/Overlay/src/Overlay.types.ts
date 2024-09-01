import { HTMLAttributes } from 'react';

export interface IOverlayProps extends HTMLAttributes<HTMLDivElement> {
    isVisible?: boolean;
    color?: string;
    blur?: number;
    zIndex?: number;
    backgroundOpacity?: number;
    center?: boolean;
}
