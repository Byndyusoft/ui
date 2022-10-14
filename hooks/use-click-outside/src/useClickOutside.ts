import { useRef, useEffect, MutableRefObject } from 'react';

export default function useClickOutside<T>(refs: Array<MutableRefObject<T>>, handler: () => void): void {
    const ref = useRef(refs);

    useEffect(() => {
        ref.current = refs;
    }, [refs]);
}