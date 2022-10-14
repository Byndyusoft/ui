import { renderHook } from '@testing-library/react-hooks';
import useEventListener from "./useEventListener";

const setup = (
    eventType: keyof GlobalEventHandlersEventMap,
    handler: (e: Event) => void
) => renderHook(() => useEventListener(eventType, handler));

describe('hooks/useEventListener', () => {
    beforeAll(() => {
        /* do anything */
    });

    it('needs tests');
});