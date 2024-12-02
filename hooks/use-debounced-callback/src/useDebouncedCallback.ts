import { useEffect, useRef, useCallback } from 'react';

export function useDebouncedCallback<A extends any[]>(
    callback: (...args: A) => void,
    delay: number
): (...args: A) => void {
    const timeoutIdRef = useRef<ReturnType<typeof setTimeout>>();

    const cleanup = () => clearTimeout(timeoutIdRef.current);

    useEffect(() => cleanup(), []);

    return useCallback((...args: A): void => {
        cleanup();

        timeoutIdRef.current = setTimeout(() => callback(...args), delay);
    }, [delay]);
}

export default useDebouncedCallback;
