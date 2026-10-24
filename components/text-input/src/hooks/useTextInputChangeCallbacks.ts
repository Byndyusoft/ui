import { ChangeEvent, ChangeEventHandler, useCallback } from 'react';
import useDebouncedCallback from '@byndyusoft-ui/use-debounced-callback';
import useThrottledCallback from '@byndyusoft-ui/use-throttled-callback';
import useLatestRef from '@byndyusoft-ui/use-latest-ref';
import useIsomorphicLayoutEffect from '@byndyusoft-ui/use-isomorphic-layout-effect';
import { ITextInputProps } from '../TextInput.types';

const DEFAULT_DEBOUNCE_DELAY = 2000;
const DEFAULT_THROTTLE_DELAY = 1000;

type TChangeCallbacks = Pick<
    ITextInputProps,
    'onChange' | 'onDebouncedChange' | 'debounceDelay' | 'onThrottledChange' | 'throttleDelay'
>;

function normalizeDelay(delay: number | undefined, fallback: number): number {
    return typeof delay === 'number' && Number.isFinite(delay) && delay >= 0 ? delay : fallback;
}

function useTextInputChangeCallbacks({
    onChange,
    onDebouncedChange,
    debounceDelay,
    onThrottledChange,
    throttleDelay
}: TChangeCallbacks): ChangeEventHandler<HTMLInputElement> {
    const handlersRef = useLatestRef({ onDebouncedChange, onThrottledChange });

    // Размонтирование может произойти до пассивных эффектов, поэтому обновляем обработчики в layout-эффекте.
    useIsomorphicLayoutEffect(() => {
        handlersRef.current = { onDebouncedChange, onThrottledChange };
    }, [handlersRef, onDebouncedChange, onThrottledChange]);

    const executeDebounced = useCallback(
        (event: ChangeEvent<HTMLInputElement>): void => {
            handlersRef.current.onDebouncedChange?.(event);
        },
        [handlersRef]
    );
    const executeThrottled = useCallback(
        (event: ChangeEvent<HTMLInputElement>): void => {
            handlersRef.current.onThrottledChange?.(event);
        },
        [handlersRef]
    );
    const debounced = useDebouncedCallback(executeDebounced, normalizeDelay(debounceDelay, DEFAULT_DEBOUNCE_DELAY));
    const throttled = useThrottledCallback(executeThrottled, normalizeDelay(throttleDelay, DEFAULT_THROTTLE_DELAY), {
        leading: false,
        trailing: true
    });

    // Сначала выполняем ожидающий debounce; пассивная очистка хука отменит его таймер.
    useIsomorphicLayoutEffect(() => debounced.flush, [debounced.flush]);

    // Throttle при размонтировании отменяем до пассивной очистки.
    useIsomorphicLayoutEffect(() => throttled.cancel, [throttled.cancel]);

    useIsomorphicLayoutEffect(() => {
        // После удаления обработчика его событие не должно попасть в новый обработчик при повторном включении.
        if (!onDebouncedChange) {
            debounced.cancel();
        }

        if (!onThrottledChange) {
            throttled.cancel();
        }
    }, [debounced.cancel, onDebouncedChange, onThrottledChange, throttled.cancel]);

    return useCallback(
        (event: ChangeEvent<HTMLInputElement>): void => {
            // onChange может синхронно размонтировать поле: ожидания должны быть зарегистрированы заранее.
            if (onDebouncedChange) {
                debounced(event);
            }

            if (onThrottledChange) {
                throttled(event);
            }

            onChange?.(event);
        },
        [debounced, throttled, onChange, onDebouncedChange, onThrottledChange]
    );
}

export default useTextInputChangeCallbacks;
