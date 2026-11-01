import { useCallback, useEffect, useMemo, useRef } from 'react';
import useLatestRef from '@byndyusoft-ui/use-latest-ref';
import useTimeout from '@byndyusoft-ui/use-timeout';
import { IDebouncedCallback } from './useDebouncedCallback.types';

function useDebouncedCallback<TArgs extends Array<unknown>>(
    callback: (...args: TArgs) => void,
    delay: number
): IDebouncedCallback<TArgs> {
    const callbackRef = useLatestRef(callback);
    const argsRef = useRef<TArgs>();

    const execute = useCallback((): void => {
        const args = argsRef.current;

        argsRef.current = undefined;

        if (args !== undefined) {
            callbackRef.current(...args);
        }
    }, [callbackRef]);

    const { start, stop } = useTimeout(execute, delay);

    const cancel = useCallback((): void => {
        stop();
        argsRef.current = undefined;
    }, [stop]);

    const flush = useCallback((): void => {
        stop();
        execute();
    }, [execute, stop]);

    useEffect(() => cancel, [cancel]);

    return useMemo(
        () =>
            Object.assign(
                (...args: TArgs): void => {
                    argsRef.current = args;
                    start();
                },
                { cancel, flush }
            ),
        [cancel, flush, start]
    );
}

export default useDebouncedCallback;
