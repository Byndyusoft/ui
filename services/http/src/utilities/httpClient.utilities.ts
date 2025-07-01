export const combineAbortSignals = (...signals: Array<AbortSignal | undefined>): AbortSignal => {
    const controller = new AbortController();

    signals.forEach(signal => {
        if (!signal) return;

        if (signal.aborted) {
            controller.abort();
        } else {
            signal.addEventListener('abort', () => controller.abort());
        }
    });

    return controller.signal;
};
