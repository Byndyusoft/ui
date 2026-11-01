export interface IDebouncedCallback<TArgs extends Array<unknown>> {
    (...args: TArgs): void;
    cancel: () => void;
    flush: () => void;
}
