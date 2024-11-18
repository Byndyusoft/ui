import type { IObserveOptions, IObserverItem, TObserverInstanceCallback } from '../useIntersectionObserver.types';

const observerMap = new Map<string, IObserverItem>();

const rootIdsWeakMap: WeakMap<Element | Document, string> = new WeakMap();

let rootId = 0;

/**
 * Generate a unique ID for the root element
 */
export function getRootId(root: IntersectionObserverInit['root']) {
    if (!root) return '0';

    if (rootIdsWeakMap.has(root)) return rootIdsWeakMap.get(root);

    rootId += 1;
    rootIdsWeakMap.set(root, rootId.toString());

    return rootIdsWeakMap.get(root);
}

/**
 * Convert the options to a string Id, based on the values.
 * Ensures we can reuse the same observer when observing elements with the same options.
 */
export function optionsToId(options: IntersectionObserverInit) {
    return Object.keys(options)
        .sort()
        .filter(key => options[key as keyof IntersectionObserverInit] !== undefined)
        .map(key => {
            return `${key}_${
                key === 'root' ? getRootId(options.root) : options[key as keyof IntersectionObserverInit]
            }`;
        })
        .toString();
}

export function createObserver(options: IntersectionObserverInit) {
    const id = optionsToId(options);
    let instance = observerMap.get(id);

    if (instance) return instance;

    const elements = new Map<Element, Array<TObserverInstanceCallback>>();
    let thresholds: number[] | readonly number[];

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const isIntersecting =
                entry.isIntersecting && thresholds.some(threshold => entry.intersectionRatio >= threshold);

            // @ts-ignore support IntersectionObserver v2
            if (options.trackVisibility && typeof entry.isVisible === 'undefined') {
                // The browser doesn't support Intersection Observer v2, falling back to v1 behavior.
                // @ts-ignore
                entry.isVisible = isIntersecting;
            }

            elements.get(entry.target)?.forEach(callback => {
                callback(isIntersecting, entry);
            });
        });
    }, options);

    thresholds =
        observer.thresholds || (Array.isArray(options.threshold) ? options.threshold : [options.threshold || 0]);

    instance = {
        id,
        observer,
        elements
    };

    observerMap.set(id, instance);

    return instance;
}

export function observe({ element, callback, options = {}, isIntersectingFallback }: IObserveOptions) {
    if (typeof window.IntersectionObserver === 'undefined' && isIntersectingFallback !== undefined) {
        const bounds = element.getBoundingClientRect();
        callback(isIntersectingFallback, {
            isIntersecting: isIntersectingFallback,
            target: element,
            intersectionRatio: typeof options.threshold === 'number' ? options.threshold : 0,
            time: 0,
            boundingClientRect: bounds,
            intersectionRect: bounds,
            rootBounds: bounds
        });
        return () => {};
    }

    const { id, observer, elements } = createObserver(options);

    const callbacks = elements.get(element) || [];

    if (!elements.has(element)) {
        elements.set(element, callbacks);
    }

    callbacks.push(callback);
    observer.observe(element);

    return function unobserve() {
        callbacks.splice(callbacks.indexOf(callback), 1);

        if (callbacks.length === 0) {
            elements.delete(element);
            observer.unobserve(element);
        }

        if (elements.size === 0) {
            observer.disconnect();
            observerMap.delete(id);
        }
    };
}
