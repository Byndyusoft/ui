import React, { useCallback, useState } from 'react';

export interface IUseWindowSize {
    width: number;
    height: number;
}

export default function useWindowSize(): IUseWindowSize {
    const [windowSize, setWindowSize] = useState<{ width: number; height: number }>({
        width: window.innerWidth,
        height: window.innerHeight
    });
    const updateWidthAndHeight = useCallback(() => {
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight
        });
    }, []);

    React.useEffect(() => {
        window.addEventListener('resize', updateWidthAndHeight);
        return () => window.removeEventListener('resize', updateWidthAndHeight);
    }, [updateWidthAndHeight]);

    return windowSize;
}
