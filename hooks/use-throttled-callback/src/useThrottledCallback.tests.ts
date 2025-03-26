import { renderHook, act } from '@testing-library/react';
import { Mock } from 'vitest';
import useThrottledCallback, { IThrottledCallbackOptions } from './useThrottledCallback';

const DELAY_THROTTLE = 500;

const setup = (callback: Mock, delay: number, options?: IThrottledCallbackOptions) =>
    renderHook(() => useThrottledCallback(callback, delay, options));

const multipleCalls = (callback: () => void, delay: number): void => {
    act(() => {
        callback();
        callback();
        callback();
        callback();
        vi.advanceTimersByTime(delay + 100);

        callback();
        vi.advanceTimersByTime(Math.max(0, delay - 100));

        callback();
        callback();
        vi.advanceTimersByTime(delay + 100);

        callback();
        callback();
        vi.advanceTimersByTime(Math.max(0, delay - 100));

        callback();
        callback();
        vi.advanceTimersByTime(delay + 100);
    });
};

describe('hook/useThrottledCallback', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.clearAllTimers();
    });

    test('should be called correctly', () => {
        const callback = vi.fn();
        const { result } = setup(callback, DELAY_THROTTLE);

        multipleCalls(result.current, DELAY_THROTTLE);

        expect(callback).toHaveBeenCalledTimes(6);
    });

    test('does not call callback immediately on multiple calls with leading: false', () => {
        const callback = vi.fn();
        const { result } = setup(callback, DELAY_THROTTLE, { leading: false });

        act(() => {
            result.current();
            result.current();
            result.current();
        });

        expect(callback).not.toHaveBeenCalled();

        vi.advanceTimersByTime(DELAY_THROTTLE);

        expect(callback).toHaveBeenCalledTimes(1);
    });

    test('does not call callback immediately on single call with leading: false', () => {
        const callback = vi.fn();
        const { result } = setup(callback, DELAY_THROTTLE, { leading: false });

        act(() => {
            result.current();
        });

        expect(callback).not.toHaveBeenCalled();

        vi.advanceTimersByTime(DELAY_THROTTLE);

        expect(callback).toHaveBeenCalledTimes(1);
    });

    test('calls callback immediately on multiple calls with trailing: false', () => {
        const callback = vi.fn();
        const { result } = setup(callback, DELAY_THROTTLE, { trailing: false });

        act(() => {
            result.current();
            result.current();
            result.current();
        });

        expect(callback).toHaveBeenCalled();

        vi.advanceTimersByTime(DELAY_THROTTLE);

        expect(callback).toHaveBeenCalledTimes(1);
    });

    test('calls callback immediately on single call with trailing: false', () => {
        const callback = vi.fn();
        const { result } = setup(callback, DELAY_THROTTLE, { trailing: false });

        act(() => {
            result.current();
        });

        expect(callback).toHaveBeenCalled();

        vi.advanceTimersByTime(DELAY_THROTTLE);

        expect(callback).toHaveBeenCalledTimes(1);
    });

    test('should not call the callback at all with leading: false and trailing: false', () => {
        const callback = vi.fn();
        const { result } = setup(callback, DELAY_THROTTLE, { leading: false, trailing: false });

        multipleCalls(result.current, DELAY_THROTTLE);

        expect(callback).not.toHaveBeenCalled();
    });

    test('should call the callback with the latest arguments after the delay', () => {
        const callback = vi.fn();
        const { result } = setup(callback, DELAY_THROTTLE);

        act(() => {
            result.current('arg-1');
        });

        act(() => {
            result.current('arg-2');
        });

        expect(callback).toHaveBeenCalledWith('arg-1');

        vi.advanceTimersByTime(DELAY_THROTTLE);

        expect(callback).toHaveBeenCalledWith('arg-2');
    });

    test('should clean up timer on unmount', () => {
        vi.spyOn(global, 'clearTimeout');

        const callback = vi.fn();
        const { result, unmount } = setup(callback, DELAY_THROTTLE);

        act(() => {
            result.current();
            result.current();
            result.current();
        });

        expect(callback).toHaveBeenCalled();

        unmount();

        vi.advanceTimersByTime(DELAY_THROTTLE);

        expect(callback).toHaveBeenCalledTimes(1);
        expect(clearTimeout).toHaveBeenCalled();
    });
});
