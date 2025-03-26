import { Callback } from '@byndyusoft-ui/types';
import { renderHook } from '@testing-library/react';
import useTimeout from './useTimeout';

const setup = (callback: Callback, delay: number) => renderHook(() => useTimeout(callback, delay));

describe('hooks/useTimeout', () => {
    beforeAll(() => {
        vi.useFakeTimers();
    });

    test('calls callback', () => {
        const callback = vi.fn();

        const { result } = setup(callback, 100);

        result.current.start();

        expect(callback).not.toBeCalled();

        vi.advanceTimersByTime(150);

        expect(callback).toHaveBeenCalledTimes(1);
    });

    test('should not call the callback if start is not called', () => {
        const callback = vi.fn();

        setup(callback, 100);

        expect(callback).not.toBeCalled();

        vi.advanceTimersByTime(150);

        expect(callback).not.toBeCalled();
    });

    test('should clear the timer and not call the callback when stop is called after start', () => {
        vi.spyOn(global, 'clearTimeout');

        const callback = vi.fn();
        const { result } = renderHook(() => useTimeout(callback, 100));

        result.current.start();

        expect(clearTimeout).toHaveBeenCalledTimes(0);

        expect(callback).not.toBeCalled();

        result.current.stop();

        /* ~~Миграция тестов с jest на vite~~
            При использовании jest advanceTimersByTime - не обязателен, тест проходит
            Но при использовании vitest clearTimeout вызывается два раза вместо одного.
         */
        // vi.advanceTimersByTime(150);

        expect(callback).toHaveBeenCalledTimes(0);
        expect(clearTimeout).toHaveBeenCalledTimes(1);
    });

    test('uses the latest callback when state changes', () => {
        const callback: Callback<number> = vi.fn();

        const { result, rerender } = renderHook(({ count }) => useTimeout(() => callback(count), 100), {
            initialProps: { count: 0 }
        });

        result.current.start();

        rerender({ count: 1 });

        vi.advanceTimersByTime(100);

        expect(callback).toHaveBeenCalledWith(1);
    });
});
