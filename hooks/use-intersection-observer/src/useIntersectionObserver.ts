import { useEffect, useRef, useState } from 'react';
import { observe } from './observe';
import type { IUseIntersectionObserverReturn, IUseIntersectionObserverOptions } from './useIntersectionObserver.types';

type State = {
    inView: boolean;
    entry?: IntersectionObserverEntry;
};

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
    const callback = useRef<IUseIntersectionObserverOptions['onChange']>();
    const [state, setState] = useState<State>({
        inView: !!initialInView,
        entry: undefined
    });

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
                setState({
                    inView,
                    entry
                });
                if (callback.current) callback.current(inView, entry);

                if (entry.isIntersecting && triggerOnce && unobserve) {
                    // If it should only trigger once, unobserve the element after it's inView
                    unobserve();
                    unobserve = undefined;
                }
            },
            fallbackInView
        });

        return () => {
            if (unobserve) {
                unobserve();
            }
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

    const entryTarget = state.entry?.target;
    const previousEntryTarget = useRef<Element>();
    if (!ref && entryTarget && !triggerOnce && !skip && previousEntryTarget.current !== entryTarget) {
        previousEntryTarget.current = entryTarget;
        setState({
            inView: !!initialInView,
            entry: undefined
        });
    }

    const result = [setRef, state.inView, state.entry] as IUseIntersectionObserverReturn;

    result.ref = result[0];
    result.inView = result[1];
    result.entry = result[2];

    return result;
}
