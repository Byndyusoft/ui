import { ChangeEvent, useLayoutEffect } from 'react';
import { act, renderHook } from '@testing-library/react-hooks';
import { ITextAreaProps } from '../TextArea.types';
import useTextAreaChangeCallbacks from './useTextAreaChangeCallbacks';

function advanceTime(milliseconds: number): void {
    act(() => {
        vi.advanceTimersByTime(milliseconds);
    });
}

function createChangeEvent(value: string): ChangeEvent<HTMLTextAreaElement> {
    const target = document.createElement('textarea');
    target.value = value;

    return {
        target,
        currentTarget: target,
        nativeEvent: new Event('input'),
        bubbles: true,
        cancelable: false,
        defaultPrevented: false,
        eventPhase: 0,
        isTrusted: false,
        timeStamp: 0,
        type: 'change',
        preventDefault: () => undefined,
        isDefaultPrevented: () => false,
        stopPropagation: () => undefined,
        isPropagationStopped: () => false,
        persist: () => undefined
    };
}

describe('text-area/useTextAreaChangeCallbacks', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.clearAllTimers();
        vi.useRealTimers();
    });

    test('вызывает onChange сразу и не создаёт таймеры без отложенных обработчиков', () => {
        const onChange = vi.fn();
        const event = createChangeEvent('Текст');
        const { result } = renderHook(() => useTextAreaChangeCallbacks({ onChange }));
        act(() => result.current(event));

        expect(onChange).toHaveBeenCalledExactlyOnceWith(event);
        expect(vi.getTimerCount()).toBe(0);
    });

    test('перезапускает debounce и передаёт последнее событие после полной паузы', () => {
        const onDebouncedChange = vi.fn();
        const first = createChangeEvent('Первое');
        const last = createChangeEvent('Последнее');
        const { result } = renderHook(() => useTextAreaChangeCallbacks({ onDebouncedChange, debounceDelay: 200 }));
        act(() => result.current(first));
        advanceTime(150);
        act(() => result.current(last));
        advanceTime(199);

        expect(onDebouncedChange).not.toHaveBeenCalled();
        advanceTime(1);
        expect(onDebouncedChange).toHaveBeenCalledExactlyOnceWith(last);
    });

    test('откладывает первый throttle и сохраняет срок окна при новых событиях', () => {
        const onThrottledChange = vi.fn();
        const first = createChangeEvent('Первое');
        const last = createChangeEvent('Последнее');
        const { result } = renderHook(() => useTextAreaChangeCallbacks({ onThrottledChange, throttleDelay: 100 }));
        act(() => result.current(first));

        expect(onThrottledChange).not.toHaveBeenCalled();
        advanceTime(99);
        act(() => result.current(last));
        advanceTime(1);
        expect(onThrottledChange).toHaveBeenCalledExactlyOnceWith(last);

        act(() => result.current(first));
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
        const { result } = renderHook(() => useTextAreaChangeCallbacks({ onThrottledChange, throttleDelay: 100 }));

        for (let index = 0; index < 25; index += 1) {
            act(() => result.current(createChangeEvent(String(index))));
            advanceTime(20);
        }

        expect(calls).toHaveLength(5);
        calls.slice(1).forEach((time, index) => expect(time - calls[index]).toBeGreaterThanOrEqual(100));
    });

    test('debounce и throttle работают независимо с последними событиями своих окон', () => {
        const onDebouncedChange = vi.fn();
        const onThrottledChange = vi.fn();
        const first = createChangeEvent('Первое');
        const second = createChangeEvent('Второе');
        const last = createChangeEvent('Последнее');
        const { result } = renderHook(() =>
            useTextAreaChangeCallbacks({ onDebouncedChange, debounceDelay: 200, onThrottledChange, throttleDelay: 100 })
        );

        act(() => result.current(first));
        advanceTime(80);
        act(() => result.current(second));
        advanceTime(20);
        expect(onThrottledChange).toHaveBeenCalledExactlyOnceWith(second);
        expect(onDebouncedChange).not.toHaveBeenCalled();
        advanceTime(60);
        act(() => result.current(last));
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
        const initialProps: ITextAreaProps = {
            onDebouncedChange: firstDebounced,
            onThrottledChange: firstThrottled,
            debounceDelay: 100,
            throttleDelay: 100
        };
        const event = createChangeEvent('Текст');
        const { result, rerender } = renderHook(props => useTextAreaChangeCallbacks(props), { initialProps });
        act(() => result.current(event));
        advanceTime(50);
        rerender({ ...initialProps, onDebouncedChange: nextDebounced, onThrottledChange: nextThrottled });
        advanceTime(50);

        expect(firstDebounced).not.toHaveBeenCalled();
        expect(firstThrottled).not.toHaveBeenCalled();
        expect(nextDebounced).toHaveBeenCalledExactlyOnceWith(event);
        expect(nextThrottled).toHaveBeenCalledExactlyOnceWith(event);
    });

    test.each(['debounce', 'throttle'] as const)(
        'изменение задержки %s сохраняет срок текущего таймера и применяется к следующему',
        mode => {
            const callback = vi.fn();
            const initialProps: ITextAreaProps =
                mode === 'debounce'
                    ? { onDebouncedChange: callback, debounceDelay: 100 }
                    : { onThrottledChange: callback, throttleDelay: 100 };
            const { result, rerender } = renderHook(props => useTextAreaChangeCallbacks(props), { initialProps });
            const event = createChangeEvent('Текст');
            act(() => result.current(event));
            advanceTime(50);
            rerender({ ...initialProps, debounceDelay: 300, throttleDelay: 300 });
            advanceTime(50);
            expect(callback).toHaveBeenCalledTimes(1);

            act(() => result.current(event));
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
            useTextAreaChangeCallbacks({ onDebouncedChange, debounceDelay: 0, onThrottledChange, throttleDelay: 0 })
        );
        const event = createChangeEvent('Текст');
        act(() => result.current(event));

        expect(onDebouncedChange).not.toHaveBeenCalled();
        expect(onThrottledChange).not.toHaveBeenCalled();
        advanceTime(0);
        expect(onDebouncedChange).toHaveBeenCalledExactlyOnceWith(event);
        expect(onThrottledChange).toHaveBeenCalledExactlyOnceWith(event);
    });

    test.each([undefined, -1, NaN, Infinity, -Infinity, 'некорректно', null])(
        'заменяет некорректную или отсутствующую задержку %s значениями по умолчанию',
        value => {
            const onDebouncedChange = vi.fn();
            const onThrottledChange = vi.fn();
            const delay = value as unknown as number;
            const { result } = renderHook(() =>
                useTextAreaChangeCallbacks({
                    onDebouncedChange,
                    debounceDelay: delay,
                    onThrottledChange,
                    throttleDelay: delay
                })
            );
            act(() => result.current(createChangeEvent('Текст')));
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
            useTextAreaChangeCallbacks({ onDebouncedChange, onThrottledChange })
        );
        const event = createChangeEvent('Текст');
        act(() => result.current(event));
        unmount();

        expect(onDebouncedChange).toHaveBeenCalledExactlyOnceWith(event);
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
        const initialProps: ITextAreaProps = { onDebouncedChange, onThrottledChange };
        const { result, rerender } = renderHook(props => useTextAreaChangeCallbacks(props), { initialProps });
        act(() => result.current(createChangeEvent('Первое')));
        rerender({});
        act(() => {
            vi.runAllTimers();
        });
        act(() => result.current(createChangeEvent('Последнее')));

        expect(onDebouncedChange).not.toHaveBeenCalled();
        expect(onThrottledChange).not.toHaveBeenCalled();
        expect(vi.getTimerCount()).toBe(0);
    });

    test('регистрирует ожидания до синхронного размонтирования внутри onChange', () => {
        let unmountHook: () => void = () => undefined;
        const onDebouncedChange = vi.fn();
        const onThrottledChange = vi.fn();
        const { result, unmount } = renderHook(() =>
            useTextAreaChangeCallbacks({ onChange: () => unmountHook(), onDebouncedChange, onThrottledChange })
        );
        unmountHook = unmount;
        const event = createChangeEvent('Текст');
        act(() => result.current(event));

        expect(onDebouncedChange).toHaveBeenCalledExactlyOnceWith(event);
        expect(onThrottledChange).not.toHaveBeenCalled();
        expect(vi.getTimerCount()).toBe(0);
    });

    test('удаление и повторное включение обработчиков не восстанавливает старое событие', () => {
        const initialDebounced = vi.fn();
        const initialThrottled = vi.fn();
        const latestDebounced = vi.fn();
        const latestThrottled = vi.fn();
        const initialProps: ITextAreaProps = {
            onDebouncedChange: initialDebounced,
            onThrottledChange: initialThrottled,
            debounceDelay: 100,
            throttleDelay: 100
        };
        const { result, rerender } = renderHook(props => useTextAreaChangeCallbacks(props), { initialProps });

        act(() => result.current(createChangeEvent('Устаревшее')));
        advanceTime(50);
        rerender({ debounceDelay: 100, throttleDelay: 100 });

        expect(vi.getTimerCount()).toBe(0);

        rerender({ ...initialProps, onDebouncedChange: latestDebounced, onThrottledChange: latestThrottled });
        advanceTime(50);

        expect(initialDebounced).not.toHaveBeenCalled();
        expect(initialThrottled).not.toHaveBeenCalled();
        expect(latestDebounced).not.toHaveBeenCalled();
        expect(latestThrottled).not.toHaveBeenCalled();

        const event = createChangeEvent('Новое');

        act(() => result.current(event));
        advanceTime(100);

        expect(latestDebounced).toHaveBeenCalledExactlyOnceWith(event);
        expect(latestThrottled).toHaveBeenCalledExactlyOnceWith(event);
    });

    test('повторный ввод из throttle-обработчика сохраняет событие для следующего интервала', () => {
        const first = createChangeEvent('Первое');
        const next = createChangeEvent('Следующее');
        const onThrottledChange = vi.fn((event: ChangeEvent<HTMLTextAreaElement>) => {
            if (event === first) {
                result.current(next);
            }
        });
        const { result } = renderHook(() => useTextAreaChangeCallbacks({ onThrottledChange, throttleDelay: 100 }));

        act(() => result.current(first));
        advanceTime(200);

        expect(onThrottledChange.mock.calls).toEqual([[first], [next]]);
    });

    test('после исключения в throttle-обработчике обрабатывает новый ввод', () => {
        const first = createChangeEvent('Первое');
        const next = createChangeEvent('Следующее');
        const onThrottledChange = vi.fn((event: ChangeEvent<HTMLTextAreaElement>) => {
            if (event === first) {
                throw new Error('Ошибка обработчика');
            }
        });
        const { result } = renderHook(() => useTextAreaChangeCallbacks({ onThrottledChange, throttleDelay: 100 }));

        act(() => result.current(first));
        expect(() => {
            advanceTime(100);
        }).toThrow('Ошибка обработчика');
        act(() => result.current(next));
        advanceTime(100);

        expect(onThrottledChange).toHaveBeenLastCalledWith(next);
    });

    test('при размонтировании отменяет throttle уже в layout-очистке', () => {
        const onThrottledChange = vi.fn();
        const timersInLayoutCleanup: Array<number> = [];
        const { result, unmount } = renderHook(() => {
            const handleChange = useTextAreaChangeCallbacks({ onThrottledChange, throttleDelay: 100 });

            useLayoutEffect(
                () => () => {
                    timersInLayoutCleanup.push(vi.getTimerCount());
                },
                []
            );

            return handleChange;
        });

        act(() => result.current(createChangeEvent('Текст')));
        unmount();

        expect(timersInLayoutCleanup).toEqual([0]);
        expect(onThrottledChange).not.toHaveBeenCalled();
    });
});
