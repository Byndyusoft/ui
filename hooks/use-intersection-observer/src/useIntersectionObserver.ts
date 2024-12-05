import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { observe } from './utilities/useIntersectionObserver.utilities';
import type {
    IUseIntersectionObserverReturn,
    IUseIntersectionObserverOptions,
    IUseIntersectionObserverTuple,
    IUseIntersectionObserverObject
} from './useIntersectionObserver.types';

export default function useIntersectionObserver(
    ref: MutableRefObject<Element | null>,
    {
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
    }: IUseIntersectionObserverOptions = {}
): IUseIntersectionObserverReturn {
    const [isIntersecting, setIsIntersecting] = useState<boolean>(Boolean(isIntersectingInitial));
    const [entry, setEntry] = useState<IntersectionObserverEntry | undefined>(undefined);

    const callback = useRef<IUseIntersectionObserverOptions['onChange']>();
    const previousEntryTarget = useRef<Element>();

    callback.current = onChange;

    useEffect(() => {
        if (skip || !ref?.current) return;

        let unobserve: (() => void) | undefined;

        unobserve = observe({
            element: ref.current,
            options: {
                root,
                rootMargin,
                threshold,
                // @ts-expect-error experimental v2 api
                trackVisibility,
                delay
            },
            callback: (isIntersectingValue, entryValue) => {
                setIsIntersecting(isIntersectingValue);
                setEntry(entryValue);

                if (callback.current) callback.current(isIntersectingValue, entryValue);

                if (entryValue.isIntersecting && triggerOnce && unobserve) {
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
        ref?.current,
        root,
        rootMargin,
        triggerOnce,
        skip,
        trackVisibility,
        isIntersectingFallback,
        delay
    ]);

    const entryTarget = entry?.target;

    if (!ref?.current && entryTarget && !triggerOnce && !skip && previousEntryTarget.current !== entryTarget) {
        previousEntryTarget.current = entryTarget;
        setIsIntersecting(Boolean(isIntersectingInitial));
        setEntry(undefined);
    }

    const tupleReturn: IUseIntersectionObserverTuple = [isIntersecting, entry];
    const objectReturn: IUseIntersectionObserverObject = {
        isIntersecting,
        entry
    };

    return Object.assign(tupleReturn, objectReturn);
}
