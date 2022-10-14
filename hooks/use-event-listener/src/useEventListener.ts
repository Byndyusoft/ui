import { useEffect } from 'react';
import useLatestRef from '@byndyusoft-ui/use-latest-ref';

export default function useEventListener(
    eventType: keyof GlobalEventHandlersEventMap,
    handler: (e: Event) => void,
    target: GlobalEventHandlers = document
) {
    const handlerRef = useLatestRef(handler);

    useEffect(() => {
        function internalHandler(e: Event) {
            return handlerRef.current(e);
        }

        target.addEventListener(eventType, internalHandler);

        return () => {
            target.removeEventListener(eventType, internalHandler);
        };
    }, [eventType, target]);
}