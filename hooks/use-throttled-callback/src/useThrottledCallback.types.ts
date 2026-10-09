export interface IThrottledCallbackOptions {
    leading?: boolean;
    trailing?: boolean;
}

export interface IThrottledCallback<TArgs extends Array<unknown>> {
    (...args: TArgs): void;
    cancel: () => void;
    flush: () => void;
}
