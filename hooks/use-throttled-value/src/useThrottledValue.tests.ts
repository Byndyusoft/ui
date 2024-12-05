import { waitFor } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react-hooks';
import useThrottledValue from './useThrottledValue';

const DELAY_THROTTLE = 500;

const setup = (initialValue: unknown, delay: number) => {
    const { result } = renderHook(() => useThrottledValue(initialValue, delay));
    return result;
};

describe('hook/useThrottledValue', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.clearAllTimers();
    });

    test('should return the initial value', () => {
        const result = setup(1, DELAY_THROTTLE);
        expect(result.current[0]).toBe(1);
    });

    test('should update the value after the delay', async () => {
        const result = setup(1, DELAY_THROTTLE);
        const getCurrentThrottledValue = () => result.current[0];
        const setThrottledValue = result.current[1];

        expect(getCurrentThrottledValue()).toBe(1);

        act(() => {
            setThrottledValue(2);
            setThrottledValue(3);
            setThrottledValue(4);
        });

        expect(getCurrentThrottledValue()).toBe(2);

        act(() => {
            jest.advanceTimersByTime(DELAY_THROTTLE);
        });

        await waitFor(() => {
            expect(getCurrentThrottledValue()).toBe(4);
        });

        act(() => {
            setThrottledValue(5);
            setThrottledValue(6);
        });

        act(() => {
            jest.advanceTimersByTime(DELAY_THROTTLE);
        });

        expect(getCurrentThrottledValue()).toBe(6);

        act(() => {
            jest.advanceTimersByTime(DELAY_THROTTLE / 2);
        });

        act(() => {
            setThrottledValue(7);
            setThrottledValue(8);
        });

        act(() => {
            jest.advanceTimersByTime(DELAY_THROTTLE);
        });

        expect(getCurrentThrottledValue()).toBe(8);
    });
});
