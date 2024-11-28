import { useCallback, useRef } from 'react';

interface IThrottleOptions {
    leading?: boolean;
    trailing?: boolean;
}

const useThrottle = <T>(
    callback: (...args: T[]) => void,
    delay: number,
    option: IThrottleOptions = { leading: true, trailing: true }
): ((...args: T[]) => void) => {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const argsRef = useRef<T[] | null>(null);

    return useCallback(
        (...args: T[]) => {
            const { leading, trailing } = option;
            const waitFunc = () => {
                if (trailing && argsRef.current) {
                    callback(...argsRef.current);
                    argsRef.current = null;
                    timeoutRef.current = setTimeout(waitFunc, delay);
                } else {
                    timeoutRef.current = null;
                }
            };

            if (!timeoutRef.current && leading) {
                callback(...args);
            } else {
                argsRef.current = args;
            }

            if (!timeoutRef.current) {
                timeoutRef.current = setTimeout(waitFunc, delay);
            }
        },
        [callback, delay, option]
    );
};

export default useThrottle;
