import { useEffect } from 'react';
import useLatestRef from '@byndyusoft-ui/use-latest-ref';

export function useEventListener<K extends keyof HTMLElementEventMap, T extends HTMLElement = HTMLDivElement>(
    eventName: K,
    handler: (this: T, event: HTMLElementEventMap[K]) => void,
    target: T,
    options?: boolean | AddEventListenerOptions
): void;

export function useEventListener<K extends keyof DocumentEventMap>(
    eventName: K,
    handler: (this: Document, event: DocumentEventMap[K]) => void,
    target: Document,
    options?: boolean | AddEventListenerOptions
): void;

export function useEventListener<K extends keyof WindowEventMap>(
    eventName: K,
    handler: (this: Window, event: WindowEventMap[K]) => void,
    target: Window,
    options?: boolean | AddEventListenerOptions
): void;

export default function useEventListener<
    KH extends keyof HTMLElementEventMap,
    KD extends keyof DocumentEventMap,
    KW extends keyof WindowEventMap
>(
    eventName: KD | KH | KW | string,
    handler: (
        this: typeof target,
        event: HTMLElementEventMap[KH] | DocumentEventMap[KD] | WindowEventMap[KW] | Event
    ) => void,
    target: Window | Document | HTMLElement = window,
    options?: boolean | AddEventListenerOptions
): void {
    const handlerRef = useLatestRef(handler);

    useEffect(() => {
        if (!target.addEventListener) {
            return;
        }

        const listener: typeof handler = event => handlerRef.current.call(target, event);

        target.addEventListener(eventName, listener, options);

        return () => {
            target.removeEventListener(eventName, listener, options);
        };
    }, [eventName, target, options]);
}
