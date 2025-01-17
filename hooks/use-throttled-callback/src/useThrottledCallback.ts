import { useCallback, useEffect, useRef } from 'react';
import { TimeoutId } from '@byndyusoft-ui/types';

export type TThrottledCallback<T = never> = (...args: T[]) => void;

export interface IThrottledCallbackOptions {
    leading?: boolean;
    trailing?: boolean;
}

const useThrottledCallback = <T>(
    callback: TThrottledCallback<T>,
    delay: number,
    { leading = true, trailing = true }: IThrottledCallbackOptions = {}
): TThrottledCallback<T> => {
    const timeoutRef = useRef<TimeoutId | null>(null);
    const argsRef = useRef<T[] | null>(null);

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
        (...args: T[]) => {
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
};

export default useThrottledCallback;
