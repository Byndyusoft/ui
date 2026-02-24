import { useCallback, useEffect, useRef } from 'react';
import { Callback, Nullable, TimeoutId } from '@byndyusoft-ui/types';
import useLatestRef from '@byndyusoft-ui/use-latest-ref';

export interface IUseTimeout {
    start: Callback;
    stop: Callback;
}

export default function useTimeout(callback: Callback, delay: Nullable<number>): IUseTimeout {
    const savedCallback = useLatestRef(callback);
    const timer = useRef<TimeoutId>();

    const stop = useCallback(() => {
        if (timer.current) {
            clearTimeout(timer.current);
            timer.current = undefined;
        }
    }, []);

    const start = useCallback((): void => {
        stop();

        if (delay !== null && delay >= 0) {
            timer.current = setTimeout(() => savedCallback.current(), delay);
        }
    }, [delay, stop, savedCallback]);

    useEffect(() => stop, []);

    return {
        start,
        stop
    };
}
