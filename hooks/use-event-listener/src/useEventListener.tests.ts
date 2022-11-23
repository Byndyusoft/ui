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

    test('import useEventListener from "@byndyusoft/ui/use-event-listener"', () => {
        expect(typeof useEventListener).toBe('function');
    });

    // test.skip('you pass an `eventType`, `handler`, and a `target`', async () => {
    //     const handler = jest.fn();
    //     const addEventListenerSpy = jest.spyOn(mockElement, 'addEventListener');
    //
    //     const { waitForNextUpdate } = renderHook(() =>
    //         useEventListener('click', handler)
    //     );
    //
    //     await waitForNextUpdate;
    //     expect(addEventListenerSpy).toBeCalled();
    //
    //     mockElement.dispatchEvent(mouseMoveEvent);
    //     expect(handler).toBeCalledWith(mouseMoveEvent);
    //
    //     addEventListenerSpy.mockRestore();
    // });

    test('"target" is optional (defaults to "document")', () => {
        const handler = jest.fn();
        const addEventListenerSpy = jest.spyOn(document, 'addEventListener');

        setup('click', handler);

        expect(addEventListenerSpy).toBeCalled();

        addEventListenerSpy.mockRestore();
    });

    it.skip('needs tests');
});