import { RefObject, useEffect } from 'react';
import useLatestRef from '@byndyusoft-ui/use-latest-ref';

function useEventListener<KM extends keyof MediaQueryListEventMap>(
    eventName: KM,
    handler: (event: MediaQueryListEventMap[KM]) => void,
    element: RefObject<MediaQueryList>,
    options?: boolean | AddEventListenerOptions
): void;

function useEventListener<KW extends keyof WindowEventMap>(
    eventName: KW,
    handler: (event: WindowEventMap[KW]) => void,
    element?: undefined,
    options?: boolean | AddEventListenerOptions
): void;

function useEventListener<KH extends keyof HTMLElementEventMap, T extends HTMLElement = HTMLDivElement>(
    eventName: KH,
    handler: (event: HTMLElementEventMap[KH]) => void,
    element: RefObject<T>,
    options?: boolean | AddEventListenerOptions
): void;

function useEventListener<
    KW extends keyof WindowEventMap,
    KH extends keyof HTMLElementEventMap,
    KM extends keyof MediaQueryListEventMap,
    T extends HTMLElement | MediaQueryList | void = void
>(
    eventName: KW | KH | KM,
    handler: (event: WindowEventMap[KW] | HTMLElementEventMap[KH] | MediaQueryListEventMap[KM] | Event) => void,
    element?: RefObject<T>,
    options?: boolean | AddEventListenerOptions
) {
    const savedHandler = useLatestRef(handler);

    useEffect(() => {
        const targetElement: T | Window = element?.current ?? window;

        if (!(targetElement && targetElement.addEventListener)) return;

        const listener: typeof handler = event => savedHandler.current(event);

        targetElement.addEventListener(eventName, listener, options);

        return () => {
            targetElement.removeEventListener(eventName, listener, options);
        };
    }, [eventName, element, options]);
}

export default useEventListener;
