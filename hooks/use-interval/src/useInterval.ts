import { useCallback, useEffect, useRef } from 'react';
import { Callback, IntervalId, Nullable } from '@byndyusoft-ui/types';
import useLatestRef from '@byndyusoft-ui/use-latest-ref';

export interface IUseInterval {
    start: Callback;
    stop: Callback;
}

export default function useInterval(callback: Callback, delay: Nullable<number>): IUseInterval {
    const savedCallback = useLatestRef(callback);
    const timer = useRef<IntervalId>();

    const stop = useCallback(() => {
        if (timer.current) {
            clearInterval(timer.current);
            timer.current = undefined;
        }
    }, []);

    const start = useCallback(() => {
        stop();

        if (delay !== null && delay >= 0) {
            timer.current = setInterval(() => savedCallback.current(), delay);
        }
    }, [delay, stop, savedCallback]);

    useEffect(() => stop, []);

    return { start, stop };
}
