import { RefObject } from 'react';

export type TResizeObserverRefs = ReadonlyArray<RefObject<Element | null>>;

export type TResizeObserverCallback = (entries: Array<ResizeObserverEntry>) => void;
