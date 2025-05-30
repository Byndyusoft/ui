import { createContext } from 'react';

export const InfiniteCanvasContext = createContext<{
    scale: number;
    setScale: (scale: number) => void;
}>({
    scale: 1,
    setScale: () => {
        console.warn('setScale has no implementation');
    }
});
