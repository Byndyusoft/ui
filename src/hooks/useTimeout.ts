import { useEffect } from 'react';
import useLatestRef from './useLatestRef';

function useTimeout(callback: () => void, delay = 0): void {
    const savedCallback = useLatestRef(callback);

    useEffect(() => {
        if (delay === 0) {
            return undefined;
        }

        const timeoutId = setTimeout(() => {
            savedCallback.current();
        }, delay);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [delay, savedCallback]);
}

export default useTimeout;
