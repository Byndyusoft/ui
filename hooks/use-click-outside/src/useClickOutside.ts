import { useCallback, MutableRefObject } from 'react';
import useEventListener from '@byndyusoft-ui/use-event-listener';

export default function useClickOutside<T extends HTMLElement>(
    handler: () => void,
    ...refs: Array<MutableRefObject<T | null> | HTMLElement | null>
): void {
    const stringifiedRefs = JSON.stringify(refs);
    const internalHandler = useCallback((e: Event): void => {
        const refWithEvent = refs.find(ref => {
            if (ref === null) {
                return false;
            }
            if (ref instanceof HTMLElement) {
                return ref.contains(e.target as Node);
            }
            return ref.current !== null && ref.current.contains(e.target as Node)
        });
        if (!refWithEvent) {
            handler();
        }
    }, [stringifiedRefs, handler]);

    useEventListener('click', internalHandler, document);
}
