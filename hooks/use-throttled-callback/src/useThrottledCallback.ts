import { Nullable } from '@byndyusoft-ui/types';
import { useCallback, useRef } from 'react';
import useTimeout from '@byndyusoft-ui/use-timeout';

export interface IThrottledCallbackOptions {
    leading?: boolean;
    trailing?: boolean;
}

function useThrottledCallback<A extends unknown[]>(
    callback: (...args: A) => void,
    delay: number,
    { leading = true, trailing = true }: IThrottledCallbackOptions = {}
): (...args: A) => void {
    const argsRef = useRef<Nullable<A>>(null);
    const isThrottling = useRef(false);

    const execute = useCallback(() => {
        if (trailing && argsRef.current) {
            callback(...argsRef.current);
            argsRef.current = null;
        }
        isThrottling.current = false;
    }, [callback, trailing]);

    const { start } = useTimeout(execute, delay);

    return useCallback(
        (...args: A) => {
            if (!isThrottling.current && leading) {
                callback(...args);
            } else {
                argsRef.current = args;
            }
            if (!isThrottling.current) {
                isThrottling.current = true;
                start();
            }
        },
        [callback, delay, leading, trailing]
    );
}

export default useThrottledCallback;
