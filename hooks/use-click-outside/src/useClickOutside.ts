import { useCallback, MutableRefObject } from 'react';
// import useEventListener from '@byndyusoft-ui/use-event-listener';
import useEventListener from '../../use-event-listener/src';

export default function useClickOutside<T extends HTMLElement = HTMLElement>(
    refs: Array<MutableRefObject<T>>,
    handler: () => void
): void {
    const internalHandler = useCallback((e: Event): void => {
        const refWithEvent = refs.find(ref => ref.current.contains(e.target as Node));
        if (!refWithEvent) {
            handler();
        }
    }, [refs, handler]);

    useEventListener('click', internalHandler);
}