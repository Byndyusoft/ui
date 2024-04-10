import { useEffect, useRef } from 'react';

export default function useDebouncedCallback<A extends any[]>(
    callback: (...args: A) => void,
    delay: number
): (...args: A) => void {
    const argsRef = useRef<A>();
    const timeout = useRef<ReturnType<typeof setTimeout>>();

    function cleanup() {
        if (timeout.current) {
            clearTimeout(timeout.current);
        }
    }

    useEffect(() => cleanup, []);

    const setDebouncedValue = (...args: A) => {
        argsRef.current = args;
        cleanup();

        timeout.current = setTimeout(() => {
            if (argsRef.current) {
                callback(...argsRef.current);
            }
        }, delay);
    };

    return setDebouncedValue;
}
