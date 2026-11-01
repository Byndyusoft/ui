import { act, renderHook } from '@testing-library/react-hooks';
import { useLayoutEffect } from 'react';
import useThrottledCallback from './useThrottledCallback';

function advanceTime(milliseconds: number): void {
    act(() => {
        vi.advanceTimersByTime(milliseconds);
    });
}

describe('hooks/useThrottledCallback', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(0);
    });

    afterEach(() => {
        vi.clearAllTimers();
        vi.useRealTimers();
    });

    test('по умолчанию выполняет одиночный вызов сразу без повторного trailing', () => {
        const callback = vi.fn();
        const { result } = renderHook(() => useThrottledCallback(callback, 100));

        act(() => result.current('первое'));

        expect(callback).toHaveBeenCalledExactlyOnceWith('первое');

        advanceTime(100);

        expect(callback).toHaveBeenCalledTimes(1);
        expect(vi.getTimerCount()).toBe(0);
    });

    test('leading и trailing сохраняют последние аргументы без перезапуска срока', () => {
        const callback = vi.fn();
        const { result } = renderHook(() => useThrottledCallback(callback, 100));

        act(() => result.current('первое', 1));
        advanceTime(80);
        act(() => result.current('второе', 2));
        advanceTime(19);
        act(() => result.current('последнее', 3));

        expect(callback).toHaveBeenCalledTimes(1);

        advanceTime(1);

        expect(callback).toHaveBeenCalledTimes(2);
        expect(callback).toHaveBeenLastCalledWith('последнее', 3);
    });

    test('соблюдает интервал между trailing и следующим leading', () => {
        const times: Array<number> = [];
        const callback = vi.fn(() => {
            times.push(Date.now());
        });
        const { result } = renderHook(() => useThrottledCallback(callback, 100));

        act(() => {
            result.current();
            result.current();
        });
        advanceTime(100);
        advanceTime(1);
        act(() => result.current());

        expect(times).toEqual([0, 100]);

        advanceTime(99);

        expect(times).toEqual([0, 100, 200]);
        advanceTime(100);
        expect(vi.getTimerCount()).toBe(0);
    });

    test.each([
        { leading: true, trailing: true },
        { leading: false, trailing: true },
        { leading: true, trailing: false }
    ])('соблюдает интервал при непрерывных вызовах с настройками %s', options => {
        const times: Array<number> = [];
        const { result } = renderHook(() =>
            useThrottledCallback(
                () => {
                    times.push(Date.now());
                },
                100,
                options
            )
        );

        for (let index = 0; index < 25; index += 1) {
            act(() => result.current());
            advanceTime(20);
        }

        expect(times.length).toBeGreaterThan(1);
        times.slice(1).forEach((time, index) => expect(time - times[index]).toBeGreaterThanOrEqual(100));
    });

    test('trailing без leading откладывает одиночный вызов на полный интервал', () => {
        const callback = vi.fn();
        const { result } = renderHook(() => useThrottledCallback(callback, 100, { leading: false }));

        act(() => result.current('первое'));
        advanceTime(99);

        expect(callback).not.toHaveBeenCalled();

        advanceTime(1);

        expect(callback).toHaveBeenCalledExactlyOnceWith('первое');
        expect(vi.getTimerCount()).toBe(0);

        advanceTime(30);
        act(() => result.current('следующее'));
        advanceTime(99);

        expect(callback).toHaveBeenCalledTimes(1);

        advanceTime(1);

        expect(callback).toHaveBeenLastCalledWith('следующее');
    });

    test('leading без trailing игнорирует подавленные вызовы', () => {
        const callback = vi.fn();
        const { result } = renderHook(() => useThrottledCallback(callback, 100, { trailing: false }));

        act(() => {
            result.current('первое');
            result.current('подавленное');
            result.current.flush();
        });
        advanceTime(100);

        expect(callback).toHaveBeenCalledExactlyOnceWith('первое');

        act(() => result.current('следующее'));

        expect(callback).toHaveBeenCalledTimes(2);
        expect(callback).toHaveBeenLastCalledWith('следующее');
    });

    test('при отключённых leading и trailing не сохраняет вызовы и не создаёт таймеры', () => {
        const callback = vi.fn();
        const { result } = renderHook(() => useThrottledCallback(callback, 100, { leading: false, trailing: false }));

        act(() => {
            result.current('подавленное');
            result.current.flush();
        });

        expect(callback).not.toHaveBeenCalled();
        expect(vi.getTimerCount()).toBe(0);
    });

    test('замена callback сохраняет функцию и использует актуальный обработчик для leading', () => {
        const initial = vi.fn();
        const latest = vi.fn();
        const { result, rerender } = renderHook(({ callback }) => useThrottledCallback(callback, 100), {
            initialProps: { callback: initial }
        });
        const saved = result.current;

        rerender({ callback: latest });

        expect(result.current).toBe(saved);

        act(() => saved('новое'));

        expect(initial).not.toHaveBeenCalled();
        expect(latest).toHaveBeenCalledExactlyOnceWith('новое');
    });

    test('замена callback использует актуальный обработчик без перезапуска trailing', () => {
        const initial = vi.fn();
        const latest = vi.fn();
        const { result, rerender } = renderHook(
            ({ callback }) => useThrottledCallback(callback, 100, { leading: false }),
            { initialProps: { callback: initial } }
        );
        const saved = result.current;

        act(() => saved('новое'));
        advanceTime(50);
        rerender({ callback: latest });
        advanceTime(50);

        expect(result.current).toBe(saved);
        expect(initial).not.toHaveBeenCalled();
        expect(latest).toHaveBeenCalledExactlyOnceWith('новое');
    });

    test('изменение delay сохраняет срок таймера и применяется к следующему ожиданию', () => {
        const callback = vi.fn();
        const { result, rerender } = renderHook(
            ({ delay }) => useThrottledCallback(callback, delay, { leading: false }),
            { initialProps: { delay: 100 } }
        );
        const { cancel, flush } = result.current;

        act(() => result.current('первое'));
        advanceTime(50);
        rerender({ delay: 200 });

        expect(result.current.cancel).toBe(cancel);
        expect(result.current.flush).toBe(flush);

        advanceTime(50);

        expect(callback).toHaveBeenCalledExactlyOnceWith('первое');

        act(() => result.current('следующее'));
        advanceTime(199);

        expect(callback).toHaveBeenCalledTimes(1);

        advanceTime(1);

        expect(callback).toHaveBeenLastCalledWith('следующее');
    });

    test('изменение delay применяется к ограничению после trailing', () => {
        const callback = vi.fn();
        const { result, rerender } = renderHook(({ delay }) => useThrottledCallback(callback, delay), {
            initialProps: { delay: 100 }
        });

        act(() => {
            result.current('первое');
            result.current('второе');
        });
        advanceTime(50);
        rerender({ delay: 200 });
        advanceTime(50);
        act(() => result.current('последнее'));
        advanceTime(199);

        expect(callback).toHaveBeenCalledTimes(2);

        advanceTime(1);

        expect(callback).toHaveBeenLastCalledWith('последнее');
        expect(callback).toHaveBeenCalledTimes(3);
    });

    test('отключение trailing очищает ожидающие аргументы, сохраняя ограничение leading', () => {
        const callback = vi.fn();
        const { result, rerender } = renderHook(({ trailing }) => useThrottledCallback(callback, 100, { trailing }), {
            initialProps: { trailing: true }
        });

        act(() => {
            result.current('первое');
            result.current('устаревшее');
        });
        advanceTime(50);
        rerender({ trailing: false });
        act(() => result.current.flush());
        advanceTime(50);
        rerender({ trailing: true });
        act(() => result.current('новое'));
        advanceTime(100);

        expect(callback.mock.calls).toEqual([['первое'], ['новое']]);
    });

    test('включение trailing не восстанавливает аргументы ранее подавленных вызовов', () => {
        const callback = vi.fn();
        const { result, rerender } = renderHook(({ trailing }) => useThrottledCallback(callback, 100, { trailing }), {
            initialProps: { trailing: false }
        });

        act(() => {
            result.current('первое');
            result.current('устаревшее');
        });
        advanceTime(100);
        rerender({ trailing: true });
        act(() => result.current('новое'));
        advanceTime(100);

        expect(callback.mock.calls).toEqual([['первое'], ['новое']]);
    });

    test('отключение обоих режимов отменяет таймер, повторное включение начинает новый интервал', () => {
        const callback = vi.fn();
        const { result, rerender } = renderHook(
            ({ enabled }) => useThrottledCallback(callback, 100, { leading: enabled, trailing: enabled }),
            { initialProps: { enabled: true } }
        );

        act(() => {
            result.current('первое');
            result.current('устаревшее');
        });
        rerender({ enabled: false });

        expect(vi.getTimerCount()).toBe(0);

        rerender({ enabled: true });
        act(() => result.current('новое'));
        advanceTime(100);

        expect(callback.mock.calls).toEqual([['первое'], ['новое']]);
    });

    test('включение leading не выполняет ожидающий trailing раньше срока', () => {
        const callback = vi.fn();
        const { result, rerender } = renderHook(({ leading }) => useThrottledCallback(callback, 100, { leading }), {
            initialProps: { leading: false }
        });

        act(() => result.current('первое'));
        advanceTime(50);
        rerender({ leading: true });
        act(() => result.current('последнее'));

        expect(callback).not.toHaveBeenCalled();

        advanceTime(50);

        expect(callback).toHaveBeenCalledExactlyOnceWith('последнее');
    });

    test('нулевая задержка оставляет leading синхронным, а trailing асинхронным', () => {
        const callback = vi.fn();
        const { result } = renderHook(() => useThrottledCallback(callback, 0));

        act(() => {
            result.current('первое');
            result.current('последнее');
        });

        expect(callback).toHaveBeenCalledExactlyOnceWith('первое');

        advanceTime(0);

        expect(callback).toHaveBeenLastCalledWith('последнее');
        expect(callback).toHaveBeenCalledTimes(2);
    });

    test('нулевая задержка без leading сохраняет асинхронность и последние аргументы', () => {
        const callback = vi.fn();
        const { result } = renderHook(() => useThrottledCallback(callback, 0, { leading: false }));

        act(() => {
            result.current('первое');
            result.current('последнее');
        });

        expect(callback).not.toHaveBeenCalled();

        advanceTime(0);

        expect(callback).toHaveBeenCalledExactlyOnceWith('последнее');
    });

    test('повторный вызов из leading-обработчика не обходит ограничение', () => {
        const callback = vi.fn((value: string) => {
            if (value === 'первое') {
                result.current('вложенное');
            }
        });
        const { result } = renderHook(() => useThrottledCallback(callback, 100));

        act(() => result.current('первое'));

        expect(callback).toHaveBeenCalledExactlyOnceWith('первое');

        advanceTime(100);

        expect(callback.mock.calls).toEqual([['первое'], ['вложенное']]);
    });

    test.each([true, false])('сохраняет повторный вызов из trailing при leading: %s', leading => {
        const callback = vi.fn((value: string) => {
            if (value === 'первое') {
                result.current('вложенное');
            }
        });
        const { result } = renderHook(() => useThrottledCallback(callback, 100, { leading }));

        act(() => {
            if (leading) {
                result.current('начальное');
            }

            result.current('первое');
        });
        advanceTime(200);

        expect(callback.mock.calls.slice(leading ? 1 : 0)).toEqual([['первое'], ['вложенное']]);
    });

    test('исключение в leading не снимает ограничение и не блокирует следующие интервалы', () => {
        const callback = vi.fn((value: string) => {
            if (value === 'ошибка') {
                throw new Error('ошибка обработчика');
            }
        });
        const { result } = renderHook(() => useThrottledCallback(callback, 100));

        expect(() => result.current('ошибка')).toThrow('ошибка обработчика');
        act(() => result.current('новое'));
        advanceTime(100);

        expect(callback.mock.calls).toEqual([['ошибка'], ['новое']]);
    });

    test.each([true, false])('после исключения в trailing принимает новые вызовы при leading: %s', leading => {
        const callback = vi.fn((value: string) => {
            if (value === 'ошибка') {
                throw new Error('ошибка обработчика');
            }
        });
        const { result } = renderHook(() => useThrottledCallback(callback, 100, { leading }));

        act(() => {
            if (leading) {
                result.current('начальное');
            }

            result.current('ошибка');
        });
        expect(() => {
            advanceTime(100);
        }).toThrow('ошибка обработчика');
        act(() => result.current('новое'));
        advanceTime(100);

        expect(callback).toHaveBeenLastCalledWith('новое');
    });

    test('cancel очищает ожидание и ограничение, позволяя новый leading', () => {
        const callback = vi.fn();
        const { result } = renderHook(() => useThrottledCallback(callback, 100));

        act(() => {
            result.current('первое');
            result.current('отменённое');
            result.current.cancel();
            result.current.flush();
        });

        expect(vi.getTimerCount()).toBe(0);

        act(() => result.current('новое'));
        advanceTime(100);

        expect(callback.mock.calls).toEqual([['первое'], ['новое']]);
    });

    test('flush немедленно выполняет последние аргументы один раз и сохраняет ограничение', () => {
        const callback = vi.fn();
        const { result } = renderHook(() => useThrottledCallback(callback, 100));

        act(() => {
            result.current('первое');
            result.current('последнее');
        });
        advanceTime(20);
        act(() => {
            result.current.flush();
            result.current.flush();
            result.current('новое');
        });

        expect(callback.mock.calls).toEqual([['первое'], ['последнее']]);

        advanceTime(99);

        expect(callback).toHaveBeenCalledTimes(2);

        advanceTime(1);

        expect(callback).toHaveBeenLastCalledWith('новое');
    });

    test('flush без ожидающего вызова не снимает ограничение leading', () => {
        const callback = vi.fn();
        const { result } = renderHook(() => useThrottledCallback(callback, 100));

        act(() => {
            result.current.flush();
            result.current('первое');
            result.current.flush();
            result.current('второе');
        });

        expect(callback).toHaveBeenCalledExactlyOnceWith('первое');

        advanceTime(100);

        expect(callback).toHaveBeenLastCalledWith('второе');
    });

    test('flush без leading завершает ожидание и сохраняет вложенный вызов', () => {
        const callback = vi.fn((value: string) => {
            if (value === 'первое') {
                result.current('вложенное');
            }
        });
        const { result } = renderHook(() => useThrottledCallback(callback, 100, { leading: false }));

        act(() => {
            result.current('первое');
            result.current.flush();
        });

        expect(callback).toHaveBeenCalledExactlyOnceWith('первое');

        advanceTime(100);

        expect(callback).toHaveBeenLastCalledWith('вложенное');
    });

    test('при размонтировании отменяет trailing, очищает таймеры и последующий flush', () => {
        const callback = vi.fn();
        const { result, unmount } = renderHook(() => useThrottledCallback(callback, 100));
        const throttled = result.current;

        act(() => {
            throttled('первое');
            throttled('отменённое');
        });
        unmount();
        act(() => throttled.flush());
        advanceTime(100);

        expect(callback).toHaveBeenCalledExactlyOnceWith('первое');
        expect(vi.getTimerCount()).toBe(0);
    });

    test.each([true, false])('синхронное размонтирование из обработчика очищает таймеры при leading: %s', leading => {
        let unmountHook: () => void = () => undefined;
        const callback = vi.fn(() => unmountHook());
        const { result, unmount } = renderHook(() => useThrottledCallback(callback, 100, { leading }));

        unmountHook = unmount;
        act(() => result.current());

        if (!leading) {
            advanceTime(100);
        }

        expect(callback).toHaveBeenCalledTimes(1);
        expect(vi.getTimerCount()).toBe(0);
    });

    test('layout-очистка может выполнить flush до пассивной отмены', () => {
        const callback = vi.fn();
        const { result, unmount } = renderHook(() => {
            const throttled = useThrottledCallback(callback, 100);

            useLayoutEffect(() => throttled.flush, [throttled.flush]);

            return throttled;
        });

        act(() => {
            result.current('первое');
            result.current('последнее');
        });
        unmount();

        expect(callback.mock.calls).toEqual([['первое'], ['последнее']]);
        expect(vi.getTimerCount()).toBe(0);
    });
});
