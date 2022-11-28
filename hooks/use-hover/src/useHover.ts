import React, { useState } from 'react';

export interface IUseHoverResult {
    isHovered: boolean;
    bind: {
        onMouseEnter: () => void;
        onMouseLeave: () => void;
    };
}

export default function useHover(): IUseHoverResult {
    const [isHovered, setIsHovered] = useState(false);

    return {
        isHovered,
        bind: {
            onMouseEnter: () => setIsHovered(true),
            onMouseLeave: () => setIsHovered(false)
        }
    };
}
