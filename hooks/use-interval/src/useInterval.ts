import { useCallback, useRef } from 'react';
import useLatestRef from '@byndyusoft-ui/use-latest-ref';
import { IUseInterval, IUseIntervalProps } from './userInterval.types';

export default function useInterval({ callback, delay }: IUseIntervalProps): IUseInterval {
    const savedCallback = useLatestRef(callback);
    const timer = useRef<ReturnType<typeof setInterval>>();

    const clear = useCallback(() => {
        if (timer.current) {
            clearInterval(timer.current);
            timer.current = undefined;
        }
    }, []);

    const start = useCallback(() => {
        if (timer.current) {
            clear();
        }

        timer.current = setInterval(() => savedCallback.current(), delay);
    }, [delay, clear, savedCallback]);

    return { start, clear };
}
