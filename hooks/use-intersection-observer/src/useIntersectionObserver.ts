import { useEffect, useRef, useState } from 'react';
import { observe } from './useIntersectionObserver.utilities';
import type { IUseIntersectionObserverReturn, IUseIntersectionObserverOptions } from './useIntersectionObserver.types';

export default function useIntersectionObserver({
    threshold,
    delay,
    trackVisibility,
    rootMargin,
    root,
    triggerOnce,
    skip,
    isIntersectingInitial,
    fallbackInView,
    onChange
}: IUseIntersectionObserverOptions = {}): IUseIntersectionObserverReturn {
    const [ref, setRef] = useState<Element | null>(null);
    const [isIntersecting, setIsIntersecting] = useState<boolean>(!!isIntersectingInitial);
    const [entry, setEntry] = useState<IntersectionObserverEntry | undefined>(undefined);

    const callback = useRef<IUseIntersectionObserverOptions['onChange']>();
    const previousEntryTarget = useRef<Element>();

    callback.current = onChange;

    useEffect(() => {
        if (skip || !ref) return;

        let unobserve: (() => void) | undefined;

        unobserve = observe({
            element: ref,
            options: {
                root,
                rootMargin,
                threshold,
                // @ts-ignore experimental v2 api
                trackVisibility,
                delay
            },
            callback: (isIntersecting, entry) => {
                setIsIntersecting(isIntersecting);
                setEntry(entry);

                if (callback.current) callback.current(isIntersecting, entry);

                if (entry.isIntersecting && triggerOnce && unobserve) {
                    unobserve();
                    unobserve = undefined;
                }
            },
            fallbackIsInView: fallbackInView
        });

        return () => {
            unobserve?.();
        };
    }, [
        Array.isArray(threshold) ? threshold.toString() : threshold,
        ref,
        root,
        rootMargin,
        triggerOnce,
        skip,
        trackVisibility,
        fallbackInView,
        delay
    ]);

    const entryTarget = entry?.target;

    if (!ref && entryTarget && !triggerOnce && !skip && previousEntryTarget.current !== entryTarget) {
        previousEntryTarget.current = entryTarget;
        setIsIntersecting(!!isIntersectingInitial);
        setEntry(undefined);
    }

    const result = [setRef, isIntersecting, entry] as IUseIntersectionObserverReturn;

    result.ref = result[0];
    result.isIntersecting = result[1];
    result.entry = result[2];

    return result;
}
