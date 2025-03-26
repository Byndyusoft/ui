import { useEffect, useRef } from 'react';

export default function usePrevious<T>(value: T): T | undefined | null {
    const ref = useRef<T>(null);

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
}
