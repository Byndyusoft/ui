import { useEffect } from 'react';
import useLatestRef from '@byndyusoft-ui/use-latest-ref';

function useEventListener<KD extends keyof DocumentEventMap>(
    eventName: KD,
    handler: (this: Document, event: DocumentEventMap[KD]) => void,
    target?: Document | null | undefined,
    options?: boolean | AddEventListenerOptions
): void;

function useEventListener<KH extends keyof HTMLElementEventMap, T extends HTMLElement = HTMLDivElement>(
    eventName: KH,
    handler: (this: T, event: HTMLElementEventMap[KH]) => void,
    target?: T | null | undefined,
    options?: boolean | AddEventListenerOptions
): void;

function useEventListener<KW extends keyof WindowEventMap>(
    eventName: KW,
    handler: (this: Window, event: WindowEventMap[KW]) => void,
    target?: Window | null | undefined,
    options?: boolean | AddEventListenerOptions
): void;

function useEventListener(
    eventName: string,
    handler: (event: Event) => void,
    target?: Document | HTMLElement | Window | null | undefined,
    options?: boolean | AddEventListenerOptions
): void;

function useEventListener<
    KD extends keyof DocumentEventMap,
    KH extends keyof HTMLElementEventMap,
    KW extends keyof WindowEventMap
>(
    eventName: KD | KH | KW | string,
    handler: (
        this: typeof target,
        event: DocumentEventMap[KD] | HTMLElementEventMap[KH] | WindowEventMap[KW] | Event
    ) => void,
    target?: Window | Document | HTMLElement | null | undefined,
    options?: boolean | AddEventListenerOptions
): void {
    const handlerRef = useLatestRef(handler);

    useEffect(() => {
        if (!target || !target.addEventListener) {
            return;
        }

        const listener: typeof handler = event => handlerRef.current.call(target, event);

        target.addEventListener(eventName, listener, options);

        return () => {
            target.removeEventListener(eventName, listener, options);
        };
    }, [eventName, target, options]);
}

export default useEventListener;
