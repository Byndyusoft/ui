import { useEffect } from 'react';
import useLatestRef from '@byndyusoft-ui/use-latest-ref';

export default function useTimeout(callback: () => void, delay: number | null): void {
    const savedCallback = useLatestRef(callback);

    useEffect(() => {
        if (delay === null) {
            return undefined;
        }

        const timeoutId = setTimeout(() => savedCallback.current(), delay);

        return () => clearTimeout(timeoutId);
    }, [delay]);
}
