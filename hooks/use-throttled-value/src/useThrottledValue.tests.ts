import { act, renderHook } from '@testing-library/react-hooks';
import useThrottledValue from './useThrottledValue';

function advanceTime(milliseconds: number): void {
    act(() => {
        vi.advanceTimersByTime(milliseconds);
    });
}

describe('hooks/useThrottledValue', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.clearAllTimers();
        vi.useRealTimers();
    });

    test('возвращает начальное состояние без таймера', () => {
        const { result } = renderHook(() => useThrottledValue(1, 100));

        expect(result.current[0]).toBe(1);
        expect(vi.getTimerCount()).toBe(0);
    });

    test('вычисляет ленивый инициализатор один раз', () => {
        const initializer = vi.fn(() => ({ count: 1 }));
        const { result, rerender } = renderHook(() => useThrottledValue(initializer, 100));

        rerender();
        act(() => result.current[1]({ count: 2 }));

        expect(initializer).toHaveBeenCalledTimes(1);
        expect(result.current[0]).toEqual({ count: 2 });
    });

    test('изменение начального значения при рендере не меняет состояние', () => {
        const { result, rerender } = renderHook(({ initialValue }) => useThrottledValue(initialValue, 100), {
            initialProps: { initialValue: 1 }
        });

        rerender({ initialValue: 99 });

        expect(result.current[0]).toBe(1);
    });

    test('первое обновление выполняет сразу, последнее применяет после интервала', () => {
        const { result } = renderHook(() => useThrottledValue(0, 100));

        act(() => {
            result.current[1](1);
            result.current[1](2);
            result.current[1](3);
        });

        expect(result.current[0]).toBe(1);

        advanceTime(100);

        expect(result.current[0]).toBe(3);

        act(() => result.current[1](4));

        expect(result.current[0]).toBe(3);

        advanceTime(100);

        expect(result.current[0]).toBe(4);
    });

    test('функции обновления получают актуальное состояние, ожидает только последняя', () => {
        const discarded = vi.fn((previous: number) => previous + 10);
        const { result } = renderHook(() => useThrottledValue(0, 100));

        act(() => {
            result.current[1](previous => previous + 1);
            result.current[1](discarded);
            result.current[1](previous => previous + 1);
        });

        expect(result.current[0]).toBe(1);
        expect(discarded).not.toHaveBeenCalled();

        advanceTime(100);

        expect(result.current[0]).toBe(2);
        expect(discarded).not.toHaveBeenCalled();
    });

    test('без leading откладывает вычисление функции обновления', () => {
        const updater = vi.fn((previous: number) => previous + 1);
        const { result } = renderHook(() => useThrottledValue(5, 100, { leading: false }));

        act(() => result.current[1](updater));

        expect(updater).not.toHaveBeenCalled();
        expect(result.current[0]).toBe(5);

        advanceTime(100);

        expect(updater).toHaveBeenCalledWith(5);
        expect(result.current[0]).toBe(6);
    });

    test('без trailing игнорирует промежуточные обновления', () => {
        const { result } = renderHook(() => useThrottledValue(0, 100, { trailing: false }));

        act(() => {
            result.current[1](1);
            result.current[1](2);
        });
        advanceTime(100);

        expect(result.current[0]).toBe(1);
    });

    test('отключение обоих режимов сохраняет состояние без таймеров', () => {
        const { result } = renderHook(() => useThrottledValue(0, 100, { leading: false, trailing: false }));

        act(() => result.current[1](1));

        expect(result.current[0]).toBe(0);
        expect(vi.getTimerCount()).toBe(0);
    });

    test('cancel отменяет ожидание и позволяет новое немедленное обновление', () => {
        const { result } = renderHook(() => useThrottledValue(0, 100));

        act(() => {
            result.current[1](1);
            result.current[1](2);
            result.current[1].cancel();
            result.current[1].flush();
        });

        expect(result.current[0]).toBe(1);
        expect(vi.getTimerCount()).toBe(0);

        act(() => result.current[1](3));

        expect(result.current[0]).toBe(3);
    });

    test('flush применяет последнее обновление один раз и сохраняет ограничение частоты', () => {
        const { result } = renderHook(() => useThrottledValue(0, 100));

        act(() => {
            result.current[1](10);
            result.current[1](previous => previous + 1);
            result.current[1].flush();
            result.current[1].flush();
        });

        expect(result.current[0]).toBe(11);

        act(() => result.current[1](20));

        expect(result.current[0]).toBe(11);

        advanceTime(100);

        expect(result.current[0]).toBe(20);
    });

    test('сохраняет ссылку на setter при обновлениях и кортеж при рендере без изменений', () => {
        const { result, rerender } = renderHook(() => useThrottledValue(0, 100));
        const initialResult = result.current;
        const [, setter] = result.current;

        rerender();

        expect(result.current).toBe(initialResult);

        act(() => setter(1));

        expect(result.current[1]).toBe(setter);
        expect(result.current).not.toBe(initialResult);
    });

    test('изменение задержки сохраняет текущий срок и применяется к следующему ожиданию', () => {
        const { result, rerender } = renderHook(({ delay }) => useThrottledValue(0, delay, { leading: false }), {
            initialProps: { delay: 100 }
        });

        act(() => result.current[1](1));
        advanceTime(50);
        rerender({ delay: 200 });
        advanceTime(50);

        expect(result.current[0]).toBe(1);

        act(() => result.current[1](2));
        advanceTime(199);

        expect(result.current[0]).toBe(1);

        advanceTime(1);

        expect(result.current[0]).toBe(2);
    });

    test('без leading нулевая задержка остаётся асинхронной', () => {
        const { result } = renderHook(() => useThrottledValue(0, 0, { leading: false }));

        act(() => result.current[1](1));

        expect(result.current[0]).toBe(0);

        advanceTime(0);

        expect(result.current[0]).toBe(1);
    });

    test('сохраняет объекты по ссылке', () => {
        const initial = { count: 0 };
        const next = { count: 1 };
        const { result } = renderHook(() => useThrottledValue(initial, 100, { leading: false }));

        act(() => result.current[1](next));

        expect(result.current[0]).toBe(initial);

        advanceTime(100);

        expect(result.current[0]).toBe(next);
    });

    test('поддерживает состояние-функцию через обёртки как useState', () => {
        const initial = vi.fn(() => 'первое');
        const next = vi.fn(() => 'следующее');
        const { result } = renderHook(() => useThrottledValue(() => initial, 100, { leading: false }));

        act(() => result.current[1](() => next));
        advanceTime(100);

        expect(result.current[0]).toBe(next);
        expect(initial).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });

    test('поддерживает null и undefined как состояния', () => {
        const { result } = renderHook(() => useThrottledValue<string | null | undefined>(null, 100));

        act(() => result.current[1](undefined));

        expect(result.current[0]).toBeUndefined();
    });

    test('при размонтировании отменяет ожидающую функцию обновления', () => {
        const updater = vi.fn((previous: number) => previous + 1);
        const { result, unmount } = renderHook(() => useThrottledValue(0, 100, { leading: false }));
        const [, setter] = result.current;

        act(() => setter(updater));
        unmount();
        act(() => setter.flush());
        advanceTime(100);

        expect(updater).not.toHaveBeenCalled();
        expect(vi.getTimerCount()).toBe(0);
    });
});
