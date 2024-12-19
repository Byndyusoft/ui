import { Callback, TimeoutId } from '@byndyusoft-ui/types';
import useLatestRef from '@byndyusoft-ui/use-latest-ref';
import { useEffect, useRef } from 'react';

export interface IUseTimeout {
    start: Callback;
    stop: Callback;
}

export default function useTimeout(callback: Callback, delay: number): IUseTimeout {
    const savedCallback = useLatestRef(callback);
    const timer = useRef<TimeoutId>();

    const stop = (): void => {
        if (timer.current) {
            clearTimeout(timer.current);
        }
    };

    const start = (): void => {
        stop();
        timer.current = setTimeout(() => {
            savedCallback.current();
        }, delay);
    };

    useEffect(() => stop, []);

    return {
        start,
        stop
    };
}
