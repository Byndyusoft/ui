import { useCallback, useEffect, useRef } from 'react';
import useLatestRef from '@byndyusoft-ui/use-latest-ref';

export type TCallback = () => void;

export default function useTimeout(callback: TCallback, delay: number | null): TCallback {
    const savedCallback = useLatestRef(callback);
    const timer = useRef<ReturnType<typeof setTimeout>>();

    const clear = useCallback(() => {
        if (timer.current) {
            clearTimeout(timer.current);
        }
    }, []);

    useEffect(() => {
        if (delay === null) {
            return undefined;
        }

        timer.current = setTimeout(() => savedCallback.current(), delay);

        return () => clear();
    }, [delay, savedCallback, clear]);

    return clear;
}
