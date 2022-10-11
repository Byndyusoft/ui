import { useCallback, useEffect, useRef } from 'react';
import useLatestRef from '@byndyusoft-ui/use-latest-ref';

export default function useInterval(callback: () => void, delay: number | null): () => void {
    const savedCallback = useLatestRef(callback);
    const timer = useRef<ReturnType<typeof setInterval>>();

    const clear = useCallback(() => {
        if (timer.current) {
            clearInterval(timer.current);
        }
    }, []);

    useEffect(() => {
        if (delay === null) {
            return undefined;
        }

        timer.current = setInterval(() => savedCallback.current(), delay);

        return () => clear();
    }, [delay]);

    return clear;
}
