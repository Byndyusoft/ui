import { useEffect } from 'react';
import useLatestRef from './useLatestRef';

function useEventListener<T extends keyof HTMLElementEventMap>(
    eventName: T,
    handler: (event: HTMLElementEventMap[T]) => void,
    target: HTMLElement
): void;

function useEventListener<T extends keyof DocumentEventMap>(
    eventName: T,
    handler: (event: DocumentEventMap[T]) => void,
    target: Document
): void;

function useEventListener<T extends keyof WindowEventMap>(
    eventName: T,
    handler: (event: WindowEventMap[T]) => void,
    target: Window
): void;

function useEventListener<T extends keyof (WindowEventMap | DocumentEventMap | HTMLElementEventMap)>(
    eventName: T,
    handler: (event: Event) => void,
    target: Window | Document | HTMLElement = window
): void {
    const savedHandler = useLatestRef(handler);

    useEffect(() => {
        const eventListener = (event: Event) => savedHandler.current(event);

        target.addEventListener(eventName, eventListener);

        return () => {
            target.removeEventListener(eventName, eventListener);
        };
    }, [eventName, target]);
}

export default useEventListener;
