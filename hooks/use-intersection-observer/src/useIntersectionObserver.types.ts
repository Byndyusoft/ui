import { Dispatch, SetStateAction } from 'react';

export type TObserverInstanceCallback = (isIntersecting: boolean, entry: IntersectionObserverEntry) => void;

export interface IObserveOptions {
    element: Element;
    callback: TObserverInstanceCallback;
    options: IntersectionObserverInit;
    isIntersectingFallback?: boolean;
}

export interface IObserverItem {
    id: string;
    observer: IntersectionObserver;
    elements: Map<Element, Array<TObserverInstanceCallback>>;
}

export interface IUseIntersectionObserverOptions extends IntersectionObserverInit {
    /** The IntersectionObserver interface's read-only `root` property identifies the Element or Document whose bounds are treated as the bounding box of the viewport for the element which is the observer's target. If the `root` is null, then the bounds of the actual document viewport are used.*/
    root?: Element | Document | null;
    /** Margin around the root. Can have values similar to the CSS margin property, e.g. `10px 20px 30px 40px` (top, right, bottom, left). */
    rootMargin?: string;
    /** Number between `0` and `1` indicating the percentage that should be visible before triggering. Can also be an `array` of numbers, to create multiple trigger points. */
    threshold?: number | number[];
    /** Only trigger the isIntersecting callback once */
    triggerOnce?: boolean;
    /** Skip assigning the observer to the `ref` */
    skip?: boolean;
    /** Set the initial value of the `isIntersecting` boolean. This can be used if you expect the element to be in the viewport to start with, and you want to trigger something when it leaves. */
    isIntersectingInitial?: boolean;
    /** Fallback to this isIntersecting state if the IntersectionObserver is unsupported, and a polyfill wasn't loaded */
    isIntersectingFallback?: boolean;
    /** IntersectionObserver v2 - Track the actual visibility of the element */
    trackVisibility?: boolean;
    /** IntersectionObserver v2 - Set a minimum delay between notifications */
    delay?: number;
    /** Call this function whenever the in view state changes */
    onChange?: (isIntersecting: boolean, entry: IntersectionObserverEntry) => void;
}

export type IUseIntersectionObserverTuple = [
    Dispatch<SetStateAction<Element | null>>,
    boolean,
    IntersectionObserverEntry | undefined
];

export type IUseIntersectionObserverObject = {
    ref: Dispatch<SetStateAction<Element | null>>;
    isIntersecting: boolean;
    entry?: IntersectionObserverEntry;
};

export type IUseIntersectionObserverReturn = IUseIntersectionObserverTuple & IUseIntersectionObserverObject;
