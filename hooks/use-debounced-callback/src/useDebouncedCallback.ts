import { useCallback, useRef } from 'react';
import { Nullable } from '@byndyusoft-ui/types';
import useTimeout from '@byndyusoft-ui/use-timeout';

export function useDebouncedCallback<A extends unknown[]>(
    callback: (...args: A) => void,
    delay: number
): (...args: A) => void {
    const argsRef = useRef<Nullable<A>>(null);

    const { start } = useTimeout(() => argsRef.current && callback(...argsRef.current), delay);

    return useCallback((...args: A): void => {
        argsRef.current = args;
        start();
    }, []);
}

export default useDebouncedCallback;
