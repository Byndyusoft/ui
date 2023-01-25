import { useCallback, MutableRefObject } from 'react';
import useEventListener from '@byndyusoft-ui/use-event-listener';

export default function useClickOutside<T extends HTMLElement>(
    handler: () => void,
    ...refs: MutableRefObject<T | null>[]
): void {
    const stringifiedRefs = JSON.stringify(refs);
    const internalHandler = useCallback((e: Event): void => {
        const refWithEvent = refs.find(ref => ref.current !== null && ref.current.contains(e.target as Node));
        if (!refWithEvent) {
            handler();
        }
    }, [stringifiedRefs, handler]);

    useEventListener('click', internalHandler, document);
}
