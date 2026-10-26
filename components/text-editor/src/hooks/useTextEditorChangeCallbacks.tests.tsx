import { useLayoutEffect } from 'react';
import { act, renderHook } from '@testing-library/react-hooks';
import { ITextEditorProps } from '../TextEditor.types';
import useTextEditorChangeCallbacks from './useTextEditorChangeCallbacks';

function advanceTime(milliseconds: number): void {
    act(() => {
        vi.advanceTimersByTime(milliseconds);
    });
}

describe('text-editor/useTextEditorChangeCallbacks', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.clearAllTimers();
        vi.useRealTimers();
    });

    test('вызывает onChange сразу и не создаёт таймеры без отложенных обработчиков', () => {
        const onChange = vi.fn();
        const markdown = 'Текст';
        const { result } = renderHook(() => useTextEditorChangeCallbacks({ onChange }));
        act(() => result.current.notify(markdown));

        expect(onChange).toHaveBeenCalledExactlyOnceWith(markdown);
        expect(vi.getTimerCount()).toBe(0);
    });

    test('перезапускает debounce и передаёт последнее событие после полной паузы', () => {
        const onDebouncedChange = vi.fn();
        const first = 'Первое';
        const last = 'Последнее';
        const { result } = renderHook(() => useTextEditorChangeCallbacks({ onDebouncedChange, debounceDelay: 200 }));
        act(() => result.current.notify(first));
        advanceTime(150);
        act(() => result.current.notify(last));
        advanceTime(199);

        expect(onDebouncedChange).not.toHaveBeenCalled();
        advanceTime(1);
        expect(onDebouncedChange).toHaveBeenCalledExactlyOnceWith(last);
    });

    test('откладывает первый throttle и сохраняет срок окна при новых событиях', () => {
        const onThrottledChange = vi.fn();
        const first = 'Первое';
        const last = 'Последнее';
        const { result } = renderHook(() => useTextEditorChangeCallbacks({ onThrottledChange, throttleDelay: 100 }));
        act(() => result.current.notify(first));

        expect(onThrottledChange).not.toHaveBeenCalled();
        advanceTime(99);
        act(() => result.current.notify(last));
        advanceTime(1);
        expect(onThrottledChange).toHaveBeenCalledExactlyOnceWith(last);

        act(() => result.current.notify(first));
        expect(onThrottledChange).toHaveBeenCalledTimes(1);
        advanceTime(99);
        expect(onThrottledChange).toHaveBeenCalledTimes(1);
        advanceTime(1);
        expect(onThrottledChange).toHaveBeenLastCalledWith(first);
        expect(onThrottledChange).toHaveBeenCalledTimes(2);
    });

    test('соблюдает интервал throttle при непрерывном вводе', () => {
        const calls: Array<number> = [];
        const onThrottledChange = vi.fn(() => calls.push(Date.now()));
        const { result } = renderHook(() => useTextEditorChangeCallbacks({ onThrottledChange, throttleDelay: 100 }));

        for (let index = 0; index < 25; index += 1) {
            act(() => result.current.notify(String(index)));
            advanceTime(20);
        }

        expect(calls).toHaveLength(5);
        calls.slice(1).forEach((time, index) => expect(time - calls[index]).toBeGreaterThanOrEqual(100));
    });

    test('debounce и throttle работают независимо с последними событиями своих окон', () => {
        const onDebouncedChange = vi.fn();
        const onThrottledChange = vi.fn();
        const first = 'Первое';
        const second = 'Второе';
        const last = 'Последнее';
        const { result } = renderHook(() =>
            useTextEditorChangeCallbacks({
                onDebouncedChange,
                debounceDelay: 200,
                onThrottledChange,
                throttleDelay: 100
            })
        );

        act(() => result.current.notify(first));
        advanceTime(80);
        act(() => result.current.notify(second));
        advanceTime(20);
        expect(onThrottledChange).toHaveBeenCalledExactlyOnceWith(second);
        expect(onDebouncedChange).not.toHaveBeenCalled();
        advanceTime(60);
        act(() => result.current.notify(last));
        advanceTime(100);
        expect(onThrottledChange).toHaveBeenLastCalledWith(last);
        expect(onDebouncedChange).not.toHaveBeenCalled();
        advanceTime(100);
        expect(onDebouncedChange).toHaveBeenCalledExactlyOnceWith(last);
    });

    test('использует актуальные обработчики без перезапуска ожидания', () => {
        const firstDebounced = vi.fn();
        const firstThrottled = vi.fn();
        const nextDebounced = vi.fn();
        const nextThrottled = vi.fn();
        const initialProps: ITextEditorProps = {
            onDebouncedChange: firstDebounced,
            onThrottledChange: firstThrottled,
            debounceDelay: 100,
            throttleDelay: 100
        };
        const markdown = 'Текст';
        const { result, rerender } = renderHook(props => useTextEditorChangeCallbacks(props), { initialProps });
        act(() => result.current.notify(markdown));
        advanceTime(50);
        rerender({ ...initialProps, onDebouncedChange: nextDebounced, onThrottledChange: nextThrottled });
        advanceTime(50);

        expect(firstDebounced).not.toHaveBeenCalled();
        expect(firstThrottled).not.toHaveBeenCalled();
        expect(nextDebounced).toHaveBeenCalledExactlyOnceWith(markdown);
        expect(nextThrottled).toHaveBeenCalledExactlyOnceWith(markdown);
    });

    test.each(['debounce', 'throttle'] as const)(
        'изменение задержки %s сохраняет срок текущего таймера и применяется к следующему',
        mode => {
            const callback = vi.fn();
            const initialProps: ITextEditorProps =
                mode === 'debounce'
                    ? { onDebouncedChange: callback, debounceDelay: 100 }
                    : { onThrottledChange: callback, throttleDelay: 100 };
            const { result, rerender } = renderHook(props => useTextEditorChangeCallbacks(props), { initialProps });
            const markdown = 'Текст';
            act(() => result.current.notify(markdown));
            advanceTime(50);
            rerender({ ...initialProps, debounceDelay: 300, throttleDelay: 300 });
            advanceTime(50);
            expect(callback).toHaveBeenCalledTimes(1);

            act(() => result.current.notify(markdown));
            advanceTime(299);
            expect(callback).toHaveBeenCalledTimes(1);
            advanceTime(1);
            expect(callback).toHaveBeenCalledTimes(2);
        }
    );

    test('задержка 0 остаётся асинхронной для обоих обработчиков', () => {
        const onDebouncedChange = vi.fn();
        const onThrottledChange = vi.fn();
        const { result } = renderHook(() =>
            useTextEditorChangeCallbacks({ onDebouncedChange, debounceDelay: 0, onThrottledChange, throttleDelay: 0 })
        );
        const markdown = 'Текст';
        act(() => result.current.notify(markdown));

        expect(onDebouncedChange).not.toHaveBeenCalled();
        expect(onThrottledChange).not.toHaveBeenCalled();
        advanceTime(0);
        expect(onDebouncedChange).toHaveBeenCalledExactlyOnceWith(markdown);
        expect(onThrottledChange).toHaveBeenCalledExactlyOnceWith(markdown);
    });

    test.each([undefined, -1, NaN, Infinity, -Infinity, 'некорректно', null])(
        'заменяет некорректную или отсутствующую задержку %s значениями по умолчанию',
        value => {
            const onDebouncedChange = vi.fn();
            const onThrottledChange = vi.fn();
            const delay = value as unknown as number;
            const { result } = renderHook(() =>
                useTextEditorChangeCallbacks({
                    onDebouncedChange,
                    debounceDelay: delay,
                    onThrottledChange,
                    throttleDelay: delay
                })
            );
            act(() => result.current.notify('Текст'));
            advanceTime(999);
            expect(onThrottledChange).not.toHaveBeenCalled();
            advanceTime(1);
            expect(onThrottledChange).toHaveBeenCalledTimes(1);
            expect(onDebouncedChange).not.toHaveBeenCalled();
            advanceTime(999);
            expect(onDebouncedChange).not.toHaveBeenCalled();
            advanceTime(1);
            expect(onDebouncedChange).toHaveBeenCalledTimes(1);
        }
    );

    test('при размонтировании завершает debounce один раз и отменяет throttle', () => {
        const onDebouncedChange = vi.fn();
        const onThrottledChange = vi.fn();
        const { result, unmount } = renderHook(() =>
            useTextEditorChangeCallbacks({ onDebouncedChange, onThrottledChange })
        );
        const markdown = 'Текст';
        act(() => result.current.notify(markdown));
        unmount();

        expect(onDebouncedChange).toHaveBeenCalledExactlyOnceWith(markdown);
        expect(onThrottledChange).not.toHaveBeenCalled();
        expect(vi.getTimerCount()).toBe(0);
        act(() => {
            vi.runAllTimers();
        });
        expect(onDebouncedChange).toHaveBeenCalledTimes(1);
    });

    test('не вызывает удалённые обработчики и не запускает для них новые таймеры', () => {
        const onDebouncedChange = vi.fn();
        const onThrottledChange = vi.fn();
        const initialProps: ITextEditorProps = { onDebouncedChange, onThrottledChange };
        const { result, rerender } = renderHook(props => useTextEditorChangeCallbacks(props), { initialProps });
        act(() => result.current.notify('Первое'));
        rerender({});
        act(() => {
            vi.runAllTimers();
        });
        act(() => result.current.notify('Последнее'));

        expect(onDebouncedChange).not.toHaveBeenCalled();
        expect(onThrottledChange).not.toHaveBeenCalled();
        expect(vi.getTimerCount()).toBe(0);
    });

    test('регистрирует ожидания до синхронного размонтирования внутри onChange', () => {
        let unmountHook: () => void = () => undefined;
        const onDebouncedChange = vi.fn();
        const onThrottledChange = vi.fn();
        const { result, unmount } = renderHook(() =>
            useTextEditorChangeCallbacks({ onChange: () => unmountHook(), onDebouncedChange, onThrottledChange })
        );
        unmountHook = unmount;
        const markdown = 'Текст';
        act(() => result.current.notify(markdown));

        expect(onDebouncedChange).toHaveBeenCalledExactlyOnceWith(markdown);
        expect(onThrottledChange).not.toHaveBeenCalled();
        expect(vi.getTimerCount()).toBe(0);
    });

    test('удаление и повторное включение обработчиков не восстанавливает старое событие', () => {
        const initialDebounced = vi.fn();
        const initialThrottled = vi.fn();
        const latestDebounced = vi.fn();
        const latestThrottled = vi.fn();
        const initialProps: ITextEditorProps = {
            onDebouncedChange: initialDebounced,
            onThrottledChange: initialThrottled,
            debounceDelay: 100,
            throttleDelay: 100
        };
        const { result, rerender } = renderHook(props => useTextEditorChangeCallbacks(props), { initialProps });

        act(() => result.current.notify('Устаревшее'));
        advanceTime(50);
        rerender({ debounceDelay: 100, throttleDelay: 100 });

        expect(vi.getTimerCount()).toBe(0);

        rerender({ ...initialProps, onDebouncedChange: latestDebounced, onThrottledChange: latestThrottled });
        advanceTime(50);

        expect(initialDebounced).not.toHaveBeenCalled();
        expect(initialThrottled).not.toHaveBeenCalled();
        expect(latestDebounced).not.toHaveBeenCalled();
        expect(latestThrottled).not.toHaveBeenCalled();

        const markdown = 'Новое';

        act(() => result.current.notify(markdown));
        advanceTime(100);

        expect(latestDebounced).toHaveBeenCalledExactlyOnceWith(markdown);
        expect(latestThrottled).toHaveBeenCalledExactlyOnceWith(markdown);
    });

    test('повторный ввод из throttle-обработчика сохраняет событие для следующего интервала', () => {
        const first = 'Первое';
        const next = 'Следующее';
        const onThrottledChange = vi.fn((markdown: string) => {
            if (markdown === first) {
                result.current.notify(next);
            }
        });
        const { result } = renderHook(() => useTextEditorChangeCallbacks({ onThrottledChange, throttleDelay: 100 }));

        act(() => result.current.notify(first));
        advanceTime(200);

        expect(onThrottledChange.mock.calls).toEqual([[first], [next]]);
    });

    test('после исключения в throttle-обработчике обрабатывает новый ввод', () => {
        const first = 'Первое';
        const next = 'Следующее';
        const onThrottledChange = vi.fn((markdown: string) => {
            if (markdown === first) {
                throw new Error('Ошибка обработчика');
            }
        });
        const { result } = renderHook(() => useTextEditorChangeCallbacks({ onThrottledChange, throttleDelay: 100 }));

        act(() => result.current.notify(first));
        expect(() => {
            advanceTime(100);
        }).toThrow('Ошибка обработчика');
        act(() => result.current.notify(next));
        advanceTime(100);

        expect(onThrottledChange).toHaveBeenLastCalledWith(next);
    });

    test('при размонтировании отменяет throttle уже в layout-очистке', () => {
        const onThrottledChange = vi.fn();
        const timersInLayoutCleanup: Array<number> = [];
        const { result, unmount } = renderHook(() => {
            const handleChange = useTextEditorChangeCallbacks({ onThrottledChange, throttleDelay: 100 });

            useLayoutEffect(
                () => () => {
                    timersInLayoutCleanup.push(vi.getTimerCount());
                },
                []
            );

            return handleChange;
        });

        act(() => result.current.notify('Текст'));
        unmount();

        expect(timersInLayoutCleanup).toEqual([0]);
        expect(onThrottledChange).not.toHaveBeenCalled();
    });
});

it('uses the latest layout callback when its parent unmounts in a layout effect', () => {
    const first = vi.fn();
    const latest = vi.fn();
    const { result, rerender, unmount } = renderHook(props => useTextEditorChangeCallbacks(props), {
        initialProps: { onDebouncedChange: first }
    });
    act(() => result.current.notify('snapshot'));
    rerender({ onDebouncedChange: latest });
    unmount();
    expect(first).not.toHaveBeenCalled();
    expect(latest).toHaveBeenCalledExactlyOnceWith('snapshot');
});
