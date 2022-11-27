import { useCallback, useState } from 'react';
import useEventListener from '@byndyusoft-ui/use-event-listener';

export interface IUseWindowSize {
    width: number;
    height: number;
}

export default function useWindowSize(): IUseWindowSize {
    const [windowSize, setWindowSize] = useState<IUseWindowSize>({
        width: window.innerWidth,
        height: window.innerHeight
    });

    const listener = useCallback(
        () =>
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            }),
        []
    );

    useEventListener('resize', listener);

    return windowSize;
}
