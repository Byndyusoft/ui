import { useEffect, useRef, useState } from 'react';
import { observe } from './utilities/useIntersectionObserver.utilities';
import type {
    IUseIntersectionObserverReturn,
    IUseIntersectionObserverOptions,
    IUseIntersectionObserverTuple,
    IUseIntersectionObserverObject
} from './useIntersectionObserver.types';

export default function useIntersectionObserver({
    threshold,
    delay,
    trackVisibility,
    rootMargin,
    root,
    triggerOnce,
    skip,
    isIntersectingInitial,
    isIntersectingFallback,
    onChange
}: IUseIntersectionObserverOptions = {}): IUseIntersectionObserverReturn {
    const [ref, setRef] = useState<Element | null>(null);
    const [isIntersecting, setIsIntersecting] = useState<boolean>(Boolean(isIntersectingInitial));
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
            isIntersectingFallback
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
        isIntersectingFallback,
        delay
    ]);

    const entryTarget = entry?.target;

    if (!ref && entryTarget && !triggerOnce && !skip && previousEntryTarget.current !== entryTarget) {
        previousEntryTarget.current = entryTarget;
        setIsIntersecting(Boolean(isIntersectingInitial));
        setEntry(undefined);
    }

    const tupleReturn: IUseIntersectionObserverTuple = [setRef, isIntersecting, entry];
    const objectReturn: IUseIntersectionObserverObject = {
        ref: setRef,
        isIntersecting,
        entry
    };

    return Object.assign(tupleReturn, objectReturn);
}
