import { useCallback, useEffect, useRef } from 'react';
import useLatestRef from '@byndyusoft-ui/use-latest-ref';

export default function useTimeout(callback: () => void, delay: number | null): () => void {
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
    }, [delay]);

    return clear;
}
