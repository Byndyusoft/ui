import { renderHook, act } from '@testing-library/react-hooks';
import useThrottledValue from '../useThrottledValue';

const DELAY_THROTTLE = 500;

const setup = (initialValue: unknown, delay: number) => {
    const { result, rerender } = renderHook(({ value }) => useThrottledValue(value, delay), {
        initialProps: { value: initialValue }
    });
    return { result, rerender };
};

describe('hook/useThrottledValue', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.clearAllTimers();
    });

    test('should return the initial value', () => {
        const { result } = setup(1, DELAY_THROTTLE);
        expect(result.current).toBe(1);
    });

    test('should update the value after the delay', () => {
        const { result, rerender } = setup(1, DELAY_THROTTLE);

        act(() => {
            rerender({ value: 2 });
        });

        expect(result.current).toBe(1);

        act(() => {
            jest.advanceTimersByTime(DELAY_THROTTLE);
        });

        expect(result.current).toBe(2);

        act(() => {
            rerender({ value: 3 });
            rerender({ value: 4 });
        });

        act(() => {
            jest.advanceTimersByTime(DELAY_THROTTLE);
        });

        expect(result.current).toBe(4);

        act(() => {
            rerender({ value: 5 });
        });

        expect(result.current).toBe(4);
    });
});
