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
    initialInView,
    fallbackInView,
    onChange
}: IUseIntersectionObserverOptions = {}): IUseIntersectionObserverReturn {
    const [ref, setRef] = useState<Element | null>(null);
    const [inView, setInView] = useState<boolean>(!!initialInView);
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
            callback: (inView, entry) => {
                setInView(inView);
                setEntry(entry);
                if (callback.current) callback.current(inView, entry);

                if (entry.isIntersecting && triggerOnce && unobserve) {
                    unobserve();
                    unobserve = undefined;
                }
            },
            fallbackInView
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
        setInView(!!initialInView);
        setEntry(undefined);
    }

    const result = [setRef, inView, entry] as IUseIntersectionObserverReturn;

    result.ref = result[0];
    result.inView = result[1];
    result.entry = result[2];

    return result;
}
