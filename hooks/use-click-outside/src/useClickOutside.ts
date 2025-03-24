import { useCallback, MutableRefObject, useRef, useEffect } from 'react';
import useEventListener from '@byndyusoft-ui/use-event-listener';

export default function useClickOutside<T extends HTMLElement>(
    handler: () => void,
    ...refs: Array<MutableRefObject<T | null> | HTMLElement | null>
): void {
    const documentRef = useRef(document);
    const latestHandler = useRef(handler);
    const latestRefs = useRef(refs);

    // Keep refs updated
    useEffect(() => {
        latestHandler.current = handler;
        latestRefs.current = refs;
    });

    const internalHandler = useCallback((e: Event) => {
        const target = e.target as Node;

        const isInside = latestRefs.current.some(ref => {
            if (!ref) return false;

            const element = ref instanceof HTMLElement
                ? ref
                : ref.current;

            return element?.contains(target);
        });

        if (!isInside) {
            latestHandler.current();
        }
    }, []); // Empty dependency array since we use latest refs

    useEventListener('click', internalHandler, documentRef);
}
