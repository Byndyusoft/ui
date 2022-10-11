import React, { useCallback } from 'react';

export interface IUseWindowSize {
    width: number;
    height: number;
}

export default function useWindowSize(): IUseWindowSize {
    const [width, setWidth] = React.useState(window.innerWidth);
    const [height, setHeight] = React.useState(window.innerHeight);

    const updateWidthAndHeight = useCallback(() => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
    }, []);

    React.useEffect(() => {
        window.addEventListener('resize', updateWidthAndHeight);
        return () => window.removeEventListener('resize', updateWidthAndHeight);
    }, [updateWidthAndHeight]);

    return {
        width,
        height
    };
}
