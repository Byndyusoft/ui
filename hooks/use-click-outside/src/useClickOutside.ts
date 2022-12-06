import { useCallback, MutableRefObject, useMemo } from 'react';
import useEventListener from '@byndyusoft-ui/use-event-listener';

export default function useClickOutside<T extends HTMLElement>(
    handler: () => void,
    ...refs: MutableRefObject<T | null>[]
): void {
    const memoizedRefs = useMemo(() => [...refs], [refs]);
    const internalHandler = useCallback((e: Event): void => {
        const refWithEvent = memoizedRefs.find(ref => ref.current !== null && ref.current.contains(e.target as Node));
        if (!refWithEvent) {
            handler();
        }
    }, [memoizedRefs, handler]);

    useEventListener('click', internalHandler, document);
}
