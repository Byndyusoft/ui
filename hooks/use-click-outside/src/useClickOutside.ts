import {useCallback, MutableRefObject, useMemo} from 'react';
import useEventListener from '@byndyusoft-ui/use-event-listener';

export default function useClickOutside<T extends HTMLElement = HTMLElement>(
    refs: Array<MutableRefObject<T>>,
    handler: () => void
): void {
    const memoizedRefs = useMemo(() => [...refs], [refs]);
    const internalHandler = useCallback((e: Event): void => {
        const refWithEvent = memoizedRefs.find(ref => ref.current.contains(e.target as Node));
        if (!refWithEvent) {
            handler();
        }
    }, [memoizedRefs, handler]);

    useEventListener('click', internalHandler);
}