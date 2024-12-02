import { useEffect, useRef } from 'react';

export function useDebouncedCallback<A extends any[]>(
    callback: (...args: A) => void,
    delay: number
): (...args: A) => void {
    const argsRef = useRef<A>();
    const timeoutIdRef = useRef<ReturnType<typeof setTimeout>>();

    const cleanup = () => clearTimeout(timeoutIdRef.current);

    useEffect(() => cleanup(), []);

    return (...args: A): void => {
        argsRef.current = args;
        cleanup();

        timeoutIdRef.current = setTimeout(() => {
            if (argsRef.current) {
                callback(...argsRef.current);
            }
        }, delay);
    };
}

export default useDebouncedCallback;
