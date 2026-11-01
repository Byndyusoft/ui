import { useCallback, useEffect, useMemo, useRef } from 'react';
import useLatestRef from '@byndyusoft-ui/use-latest-ref';
import useTimeout from '@byndyusoft-ui/use-timeout';
import { IThrottledCallback, IThrottledCallbackOptions } from './useThrottledCallback.types';

function useThrottledCallback<TArgs extends Array<unknown>>(
    callback: (...args: TArgs) => void,
    delay: number,
    { leading = true, trailing = true }: IThrottledCallbackOptions = {}
): IThrottledCallback<TArgs> {
    const callbackRef = useLatestRef(callback);
    const optionsRef = useLatestRef({ leading, trailing });
    const argsRef = useRef<TArgs>();
    const isThrottlingRef = useRef(false);
    const restartRef = useRef<() => void>(() => undefined);

    const execute = useCallback((): void => {
        const args = argsRef.current;
        const options = optionsRef.current;

        // Завершаем предыдущее ожидание до пользовательского кода: вложенные вызовы должны сохраняться.
        argsRef.current = undefined;
        isThrottlingRef.current = false;

        if (args !== undefined && options.trailing) {
            if (options.leading) {
                // Следующий leading нельзя выполнять сразу после trailing.
                isThrottlingRef.current = true;
                restartRef.current();
            }

            callbackRef.current(...args);
        }
    }, [callbackRef, optionsRef]);

    const { start, stop } = useTimeout(execute, delay);

    useEffect(() => {
        restartRef.current = start;
    }, [start]);

    const cancel = useCallback((): void => {
        stop();
        argsRef.current = undefined;
        isThrottlingRef.current = false;
    }, [stop]);

    const flush = useCallback((): void => {
        if (argsRef.current !== undefined) {
            stop();
            execute();
        }
    }, [execute, stop]);

    useEffect(() => {
        if (!trailing) {
            argsRef.current = undefined;
        }

        if (!leading && !trailing) {
            cancel();
        }
    }, [cancel, leading, trailing]);

    useEffect(() => cancel, [cancel]);

    return useMemo(
        () =>
            Object.assign(
                (...args: TArgs): void => {
                    if (!leading && !trailing) {
                        return;
                    }

                    if (isThrottlingRef.current) {
                        if (trailing) {
                            argsRef.current = args;
                        }

                        return;
                    }

                    // Блокировка и таймер создаются до callback, в том числе на случай исключения.
                    isThrottlingRef.current = true;
                    start();

                    if (leading) {
                        callbackRef.current(...args);
                    } else {
                        argsRef.current = args;
                    }
                },
                { cancel, flush }
            ),
        [callbackRef, cancel, flush, leading, start, trailing]
    );
}

export default useThrottledCallback;
export type { IThrottledCallback, IThrottledCallbackOptions } from './useThrottledCallback.types';
