import { useCallback } from 'react';
import useDebouncedCallback from '@byndyusoft-ui/use-debounced-callback';
import useThrottledCallback from '@byndyusoft-ui/use-throttled-callback';
import useLatestRef from '@byndyusoft-ui/use-latest-ref';
import useIsomorphicLayoutEffect from '@byndyusoft-ui/use-isomorphic-layout-effect';
import { ITextEditorProps } from '../TextEditor.types';

const DEFAULT_DEBOUNCE_DELAY = 2000;
const DEFAULT_THROTTLE_DELAY = 1000;

type TChangeCallbacks = Pick<
    ITextEditorProps,
    'onChange' | 'onDebouncedChange' | 'debounceDelay' | 'onThrottledChange' | 'throttleDelay'
>;

function normalizeDelay(delay: number | undefined, fallback: number): number {
    return typeof delay === 'number' && Number.isFinite(delay) && delay >= 0 ? delay : fallback;
}

function useTextEditorChangeCallbacks({
    onChange,
    onDebouncedChange,
    debounceDelay,
    onThrottledChange,
    throttleDelay
}: TChangeCallbacks): { notify: (markdown: string) => void; cancel: () => void } {
    const handlersRef = useLatestRef({ onDebouncedChange, onThrottledChange });

    // Размонтирование может произойти до пассивных эффектов, поэтому обновляем обработчики в layout-эффекте.
    useIsomorphicLayoutEffect(() => {
        handlersRef.current = { onDebouncedChange, onThrottledChange };
    }, [handlersRef, onDebouncedChange, onThrottledChange]);

    const executeDebounced = useCallback(
        (markdown: string): void => {
            handlersRef.current.onDebouncedChange?.(markdown);
        },
        [handlersRef]
    );
    const executeThrottled = useCallback(
        (markdown: string): void => {
            handlersRef.current.onThrottledChange?.(markdown);
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
        // После удаления обработчика его снимок не должно попасть в новый обработчик при повторном включении.
        if (!onDebouncedChange) {
            debounced.cancel();
        }

        if (!onThrottledChange) {
            throttled.cancel();
        }
    }, [debounced.cancel, onDebouncedChange, onThrottledChange, throttled.cancel]);

    const notify = useCallback(
        (markdown: string): void => {
            // onChange может синхронно размонтировать поле: ожидания должны быть зарегистрированы заранее.
            if (onDebouncedChange) {
                debounced(markdown);
            }

            if (onThrottledChange) {
                throttled(markdown);
            }

            onChange?.(markdown);
        },
        [debounced, throttled, onChange, onDebouncedChange, onThrottledChange]
    );
    const cancel = useCallback((): void => {
        debounced.cancel();
        throttled.cancel();
    }, [debounced, throttled]);

    return { notify, cancel };
}

export default useTextEditorChangeCallbacks;
