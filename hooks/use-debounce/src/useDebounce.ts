import { useEffect, useRef, useState } from 'react';

export default function useDebounce(value: string, delay = 300): [string, boolean] {
    const [debouncedValue, setDebouncedValue] = useState(value);
    const timeout = useRef<NodeJS.Timeout>();

    useEffect(() => {
        timeout.current = setTimeout(() => {
            timeout.current = undefined;
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timeout.current);
        };
    }, [value, delay]);

    const isReady = !timeout.current;

    return [debouncedValue, isReady];
}
