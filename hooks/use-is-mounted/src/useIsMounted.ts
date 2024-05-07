import { useRef, useEffect } from 'react';

export default function useIsMounted(): boolean {
    const isMounted = useRef(false);

    useEffect(() => {
        isMounted.current = true;
    }, []);

    return isMounted.current;
}
