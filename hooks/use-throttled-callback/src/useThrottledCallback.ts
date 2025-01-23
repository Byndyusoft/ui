import { useCallback, useEffect, useRef } from 'react';
import { TimeoutId, Nullable } from '@byndyusoft-ui/types';

export interface IThrottledCallbackOptions {
    leading?: boolean;
    trailing?: boolean;
}

function useThrottledCallback<A extends unknown[]>(
    callback: (...args: A) => void,
    delay: number,
    { leading = true, trailing = true }: IThrottledCallbackOptions = {}
): (...args: A) => void {
    const timeoutRef = useRef<TimeoutId | null>(null);
    const argsRef = useRef<Nullable<A>>(null);

    const cleanup = useCallback((): void => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    const waitFunc = useCallback((): void => {
        cleanup();

        if (trailing && argsRef.current) {
            callback(...argsRef.current);
            argsRef.current = null;
            timeoutRef.current = setTimeout(waitFunc, delay);
        }
    }, [callback, delay, trailing, cleanup]);

    useEffect(() => cleanup, [cleanup]);

    return useCallback(
        (...args: A) => {
            if (!timeoutRef.current && leading) {
                callback(...args);
            } else {
                argsRef.current = args;
            }

            if (!timeoutRef.current) {
                timeoutRef.current = setTimeout(waitFunc, delay);
            }
        },
        [callback, delay, waitFunc, leading]
    );
}

export default useThrottledCallback;
