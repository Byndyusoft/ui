import { useLayoutEffect } from 'react';
import { act, renderHook } from '@testing-library/react-hooks';
import useDebouncedCallback from './useDebouncedCallback';

describe('hooks/useDebouncedCallback', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.clearAllTimers();
        vi.useRealTimers();
    });

    test('вызывает обработчик только после полной паузы', () => {
        const callback = vi.fn();
        const { result } = renderHook(() => useDebouncedCallback(callback, 100));

        act(() => result.current('first'));
        vi.advanceTimersByTime(99);

        expect(callback).not.toHaveBeenCalled();

        vi.advanceTimersByTime(1);

        expect(callback).toHaveBeenCalledExactlyOnceWith('first');
    });

    test('перезапускает ожидание и сохраняет последние аргументы', () => {
        const callback = vi.fn();
        const { result } = renderHook(() => useDebouncedCallback(callback, 100));

        act(() => result.current('first', 1));
        vi.advanceTimersByTime(90);
        act(() => result.current('last', 2));
        vi.advanceTimersByTime(99);

        expect(callback).not.toHaveBeenCalled();

        vi.advanceTimersByTime(1);

        expect(callback).toHaveBeenCalledExactlyOnceWith('last', 2);
    });

    test('поддерживает обработчики без аргументов', () => {
        const callback = vi.fn();
        const { result } = renderHook(() => useDebouncedCallback(callback, 100));

        act(() => result.current());
        vi.advanceTimersByTime(100);

        expect(callback).toHaveBeenCalledExactlyOnceWith();
    });

    test('использует актуальный обработчик без перезапуска ожидающего таймера', () => {
        const initialCallback = vi.fn();
        const nextCallback = vi.fn();
        const { result, rerender } = renderHook(({ callback }) => useDebouncedCallback(callback, 100), {
            initialProps: { callback: initialCallback }
        });

        act(() => result.current('value'));
        vi.advanceTimersByTime(50);
        rerender({ callback: nextCallback });
        vi.advanceTimersByTime(50);

        expect(initialCallback).not.toHaveBeenCalled();
        expect(nextCallback).toHaveBeenCalledExactlyOnceWith('value');
    });

    test('применяет новую задержку только к следующим вызовам', () => {
        const callback = vi.fn();
        const { result, rerender } = renderHook(({ delay }) => useDebouncedCallback(callback, delay), {
            initialProps: { delay: 100 }
        });

        act(() => result.current('first'));
        vi.advanceTimersByTime(50);
        rerender({ delay: 200 });
        vi.advanceTimersByTime(50);

        expect(callback).toHaveBeenCalledExactlyOnceWith('first');

        act(() => result.current('second'));
        vi.advanceTimersByTime(199);

        expect(callback).toHaveBeenCalledTimes(1);

        vi.advanceTimersByTime(1);

        expect(callback).toHaveBeenLastCalledWith('second');
        expect(callback).toHaveBeenCalledTimes(2);
    });

    test('использует новую задержку при перезапуске существующего таймера', () => {
        const callback = vi.fn();
        const { result, rerender } = renderHook(({ delay }) => useDebouncedCallback(callback, delay), {
            initialProps: { delay: 100 }
        });

        act(() => result.current('first'));
        vi.advanceTimersByTime(50);
        rerender({ delay: 200 });
        act(() => result.current('last'));
        vi.advanceTimersByTime(199);

        expect(callback).not.toHaveBeenCalled();

        vi.advanceTimersByTime(1);

        expect(callback).toHaveBeenCalledExactlyOnceWith('last');
    });

    test('сохраняет асинхронное выполнение при нулевой задержке', () => {
        const callback = vi.fn();
        const { result } = renderHook(() => useDebouncedCallback(callback, 0));

        act(() => result.current('value'));

        expect(callback).not.toHaveBeenCalled();

        vi.advanceTimersByTime(0);

        expect(callback).toHaveBeenCalledExactlyOnceWith('value');
    });

    test('cancel очищает таймер и ожидающий вызов', () => {
        const callback = vi.fn();
        const { result } = renderHook(() => useDebouncedCallback(callback, 100));

        act(() => {
            result.current('value');
            result.current.cancel();
            result.current.flush();
        });
        vi.advanceTimersByTime(100);

        expect(callback).not.toHaveBeenCalled();
        expect(vi.getTimerCount()).toBe(0);
    });

    test('позволяет запланировать новый вызов после отмены', () => {
        const callback = vi.fn();
        const { result } = renderHook(() => useDebouncedCallback(callback, 100));

        act(() => {
            result.current('cancelled');
            result.current.cancel();
            result.current('next');
        });
        vi.advanceTimersByTime(100);

        expect(callback).toHaveBeenCalledExactlyOnceWith('next');
    });

    test('flush сразу передаёт последние аргументы один раз', () => {
        const callback = vi.fn();
        const { result } = renderHook(() => useDebouncedCallback(callback, 100));

        act(() => {
            result.current('first');
            result.current('last');
            result.current.flush();
            result.current.flush();
        });
        vi.advanceTimersByTime(100);

        expect(callback).toHaveBeenCalledExactlyOnceWith('last');
        expect(vi.getTimerCount()).toBe(0);
    });

    test('flush ничего не делает без ожидающего вызова', () => {
        const callback = vi.fn();
        const { result } = renderHook(() => useDebouncedCallback(callback, 100));

        act(() => result.current.flush());

        expect(callback).not.toHaveBeenCalled();

        act(() => result.current('value'));
        vi.advanceTimersByTime(100);
        act(() => result.current.flush());

        expect(callback).toHaveBeenCalledExactlyOnceWith('value');
    });

    test('отменяет ожидающий вызов при размонтировании', () => {
        const callback = vi.fn();
        const { result, unmount } = renderHook(() => useDebouncedCallback(callback, 100));
        const debounced = result.current;

        act(() => debounced('value'));
        unmount();
        debounced.flush();
        vi.advanceTimersByTime(100);

        expect(callback).not.toHaveBeenCalled();
        expect(vi.getTimerCount()).toBe(0);
    });

    test('позволяет выполнить flush в layout-очистке до пассивной отмены', () => {
        const callback = vi.fn();
        const { result, unmount } = renderHook(() => {
            const debounced = useDebouncedCallback(callback, 100);

            useLayoutEffect(() => debounced.flush, [debounced.flush]);

            return debounced;
        });

        act(() => result.current('value'));
        unmount();
        vi.advanceTimersByTime(100);

        expect(callback).toHaveBeenCalledExactlyOnceWith('value');
    });

    test('сохраняет новый вызов, запланированный внутри обработчика', () => {
        const callback = vi.fn((value: string) => {
            if (value === 'first') {
                result.current('second');
            }
        });
        const { result } = renderHook(() => useDebouncedCallback(callback, 100));

        act(() => result.current('first'));
        vi.advanceTimersByTime(100);

        expect(callback).toHaveBeenCalledExactlyOnceWith('first');

        vi.advanceTimersByTime(100);

        expect(callback).toHaveBeenCalledTimes(2);
        expect(callback).toHaveBeenLastCalledWith('second');
    });

    test('сохраняет новый вызов, запланированный во время flush', () => {
        const callback = vi.fn((value: string) => {
            if (value === 'first') {
                result.current('second');
            }
        });
        const { result } = renderHook(() => useDebouncedCallback(callback, 100));

        act(() => {
            result.current('first');
            result.current.flush();
        });
        vi.advanceTimersByTime(100);

        expect(callback).toHaveBeenCalledTimes(2);
        expect(callback).toHaveBeenLastCalledWith('second');
    });
});
