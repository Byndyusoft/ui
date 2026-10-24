import { act, renderHook } from '@testing-library/react-hooks';
import useDebouncedValue from './useDebouncedValue';

function advanceTime(milliseconds: number): void {
    act(() => {
        vi.advanceTimersByTime(milliseconds);
    });
}

describe('hooks/useDebouncedValue', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.clearAllTimers();
        vi.useRealTimers();
    });

    test('возвращает начальное значение и setter без создания таймера', () => {
        const { result } = renderHook(() => useDebouncedValue('начальное', 100));

        expect(result.current[0]).toBe('начальное');
        expect(result.current[1]).toBeTypeOf('function');
        expect(vi.getTimerCount()).toBe(0);
    });

    test('вызывает ленивый инициализатор только при монтировании', () => {
        const initializer = vi.fn(() => ({ count: 1 }));
        const { result, rerender } = renderHook(() => useDebouncedValue(initializer, 100));
        const [initialState] = result.current;

        rerender();
        act(() => result.current[1]({ count: 2 }));
        advanceTime(100);

        expect(initializer).toHaveBeenCalledTimes(1);
        expect(initialState).toEqual({ count: 1 });
        expect(result.current[0]).toEqual({ count: 2 });
    });

    test('изменение начального значения при рендере не меняет состояние и ожидание', () => {
        const { result, rerender } = renderHook(({ initialValue }) => useDebouncedValue(initialValue, 100), {
            initialProps: { initialValue: 0 }
        });

        act(() => result.current[1](1));
        advanceTime(50);
        rerender({ initialValue: 99 });

        expect(result.current[0]).toBe(0);

        advanceTime(50);

        expect(result.current[0]).toBe(1);
    });

    test('setter обновляет значение только после полной паузы', () => {
        const { result } = renderHook(() => useDebouncedValue('начальное', 100));

        act(() => result.current[1]('новое'));
        advanceTime(99);

        expect(result.current[0]).toBe('начальное');

        advanceTime(1);

        expect(result.current[0]).toBe('новое');
        expect(vi.getTimerCount()).toBe(0);
    });

    test('каждый вызов setter перезапускает ожидание с последним значением', () => {
        const { result } = renderHook(() => useDebouncedValue('', 100));

        act(() => result.current[1]('первое'));
        advanceTime(90);
        act(() => result.current[1]('последнее'));
        advanceTime(99);

        expect(result.current[0]).toBe('');

        advanceTime(1);

        expect(result.current[0]).toBe('последнее');
    });

    test('выполняет только последнюю функцию обновления после паузы', () => {
        const discardedUpdater = vi.fn((previous: number) => previous + 10);
        const lastUpdater = vi.fn((previous: number) => previous + 1);
        const { result } = renderHook(() => useDebouncedValue(5, 100));

        act(() => {
            result.current[1](discardedUpdater);
            result.current[1](lastUpdater);
        });

        expect(discardedUpdater).not.toHaveBeenCalled();
        expect(lastUpdater).not.toHaveBeenCalled();
        expect(result.current[0]).toBe(5);

        advanceTime(100);

        expect(discardedUpdater).not.toHaveBeenCalled();
        expect(lastUpdater).toHaveBeenCalledWith(5);
        expect(result.current[0]).toBe(6);
    });

    test('функция обновления получает актуальное применённое состояние', () => {
        const { result } = renderHook(() => useDebouncedValue(0, 100));
        const [, setter] = result.current;

        act(() => setter(10));
        advanceTime(100);
        act(() => setter(previous => previous + 1));
        advanceTime(100);

        expect(result.current[0]).toBe(11);
    });

    test('сохраняет setter и кортеж при рендере без изменений', () => {
        const { result, rerender } = renderHook(() => useDebouncedValue(0, 100));
        const initialResult = result.current;
        const [, setter] = result.current;

        act(() => setter(1));
        advanceTime(50);
        rerender();

        expect(result.current).toBe(initialResult);

        advanceTime(50);

        expect(result.current[0]).toBe(1);
        expect(result.current[1]).toBe(setter);
        expect(result.current).not.toBe(initialResult);
    });

    test('изменение задержки сохраняет срок текущего обновления', () => {
        const { result, rerender } = renderHook(({ delay }) => useDebouncedValue(0, delay), {
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

    test('следующий вызов setter перезапускает ожидание с новой задержкой', () => {
        const { result, rerender } = renderHook(({ delay }) => useDebouncedValue(0, delay), {
            initialProps: { delay: 100 }
        });

        act(() => result.current[1](1));
        advanceTime(50);
        rerender({ delay: 200 });
        act(() => result.current[1](2));
        advanceTime(199);

        expect(result.current[0]).toBe(0);

        advanceTime(1);

        expect(result.current[0]).toBe(2);
    });

    test('при нулевой задержке обновляет значение асинхронно', () => {
        const { result } = renderHook(() => useDebouncedValue(0, 0));

        act(() => result.current[1](1));

        expect(result.current[0]).toBe(0);

        advanceTime(0);

        expect(result.current[0]).toBe(1);
    });

    test('сохраняет переданные объекты по ссылке', () => {
        const initialValue = { text: 'начальное' };
        const nextValue = { text: 'новое' };
        const { result } = renderHook(() => useDebouncedValue(initialValue, 100));

        act(() => result.current[1](nextValue));

        expect(result.current[0]).toBe(initialValue);

        advanceTime(100);

        expect(result.current[0]).toBe(nextValue);
    });

    test('поддерживает состояние-функцию через обёртки как useState', () => {
        const initialValue = vi.fn(() => 'начальное');
        const nextValue = vi.fn(() => 'новое');
        const { result } = renderHook(() => useDebouncedValue(() => initialValue, 100));

        expect(result.current[0]).toBe(initialValue);

        act(() => result.current[1](() => nextValue));
        advanceTime(100);

        expect(result.current[0]).toBe(nextValue);
        expect(initialValue).not.toHaveBeenCalled();
        expect(nextValue).not.toHaveBeenCalled();
    });

    test('поддерживает null и undefined как значения состояния', () => {
        const { result } = renderHook(() => useDebouncedValue<string | null | undefined>(null, 100));

        act(() => result.current[1]('текст'));
        advanceTime(100);

        expect(result.current[0]).toBe('текст');

        act(() => result.current[1](undefined));
        advanceTime(100);

        expect(result.current[0]).toBeUndefined();
    });

    test('cancel отменяет обновление и позволяет запланировать следующее', () => {
        const { result } = renderHook(() => useDebouncedValue(0, 100));
        const updater = vi.fn((previous: number) => previous + 1);

        act(() => {
            result.current[1](updater);
            result.current[1].cancel();
            result.current[1].flush();
        });
        advanceTime(100);

        expect(result.current[0]).toBe(0);
        expect(updater).not.toHaveBeenCalled();
        expect(vi.getTimerCount()).toBe(0);

        act(() => result.current[1](2));
        advanceTime(100);

        expect(result.current[0]).toBe(2);
    });

    test('flush сразу применяет последнее обновление без повторного вызова по таймеру', () => {
        const { result } = renderHook(() => useDebouncedValue(0, 100));
        const updater = vi.fn((previous: number) => previous + 1);

        act(() => {
            result.current[1](10);
            result.current[1](updater);
            result.current[1].flush();
            result.current[1].flush();
        });

        expect(result.current[0]).toBe(1);
        expect(updater).toHaveBeenCalledTimes(1);
        expect(vi.getTimerCount()).toBe(0);

        advanceTime(100);

        expect(updater).toHaveBeenCalledTimes(1);
    });

    test('отменяет ожидающее обновление при размонтировании', () => {
        const { result, unmount } = renderHook(() => useDebouncedValue(0, 100));
        const [, setter] = result.current;
        const updater = vi.fn((previous: number) => previous + 1);

        act(() => setter(updater));

        expect(vi.getTimerCount()).toBe(1);

        unmount();
        act(() => setter.flush());
        advanceTime(100);

        expect(vi.getTimerCount()).toBe(0);
        expect(updater).not.toHaveBeenCalled();
        expect(result.current[0]).toBe(0);
    });
});
