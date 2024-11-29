import { useCallback, useEffect, useRef } from 'react';

type TThrottleCallback<T> = (...args: T[]) => void;

export interface IThrottleOptions {
    leading?: boolean;
    trailing?: boolean;
}

const useThrottle = <T>(
    callback: TThrottleCallback<T>,
    delay: number,
    { leading = true, trailing = true }: IThrottleOptions = {}
): TThrottleCallback<T> => {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const argsRef = useRef<T[] | null>(null);

    const cleanup = (): void => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    };

    const waitFunc = useCallback((): void => {
        if (trailing && argsRef.current) {
            callback(...argsRef.current);
            argsRef.current = null;
            timeoutRef.current = setTimeout(waitFunc, delay);
        } else {
            timeoutRef.current = null;
        }
    }, [callback, delay, trailing]);

    useEffect(() => {
        return cleanup;
    }, []);

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

export default useThrottle;
