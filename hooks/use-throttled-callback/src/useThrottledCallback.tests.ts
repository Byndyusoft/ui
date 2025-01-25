import { renderHook, act } from '@testing-library/react-hooks';
import useThrottledCallback, { IThrottledCallbackOptions } from './useThrottledCallback';

const DELAY_THROTTLE = 500;

const setup = (callback: jest.Mock, delay: number, options?: IThrottledCallbackOptions) => {
    return renderHook(() => useThrottledCallback(callback, delay, options));
};

const multipleCalls = (callback: () => void, delay: number): void => {
    act(() => {
        callback();
        callback();
        callback();
        callback();
        jest.advanceTimersByTime(delay + 100);

        callback();
        jest.advanceTimersByTime(Math.max(0, delay - 100));

        callback();
        callback();
        jest.advanceTimersByTime(delay + 100);

        callback();
        callback();
        jest.advanceTimersByTime(Math.max(0, delay - 100));

        callback();
        callback();
        jest.advanceTimersByTime(delay + 100);
    });
};

describe('hook/useThrottledCallback', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.clearAllTimers();
    });

    test('should be called correctly', () => {
        const callback = jest.fn();
        const { result } = setup(callback, DELAY_THROTTLE);

        multipleCalls(result.current, DELAY_THROTTLE);

        expect(callback).toHaveBeenCalledTimes(6);
    });

    test('does not call callback immediately on multiple calls with leading: false', () => {
        const callback = jest.fn();
        const { result } = setup(callback, DELAY_THROTTLE, { leading: false });

        act(() => {
            result.current();
            result.current();
            result.current();
        });

        expect(callback).not.toHaveBeenCalled();

        jest.advanceTimersByTime(DELAY_THROTTLE);

        expect(callback).toHaveBeenCalledTimes(1);
    });

    test('does not call callback immediately on single call with leading: false', () => {
        const callback = jest.fn();
        const { result } = setup(callback, DELAY_THROTTLE, { leading: false });

        act(() => {
            result.current();
        });

        expect(callback).not.toHaveBeenCalled();

        jest.advanceTimersByTime(DELAY_THROTTLE);

        expect(callback).toHaveBeenCalledTimes(1);
    });

    test('calls callback immediately on multiple calls with trailing: false', () => {
        const callback = jest.fn();
        const { result } = setup(callback, DELAY_THROTTLE, { trailing: false });

        act(() => {
            result.current();
            result.current();
            result.current();
        });

        expect(callback).toHaveBeenCalled();

        jest.advanceTimersByTime(DELAY_THROTTLE);

        expect(callback).toHaveBeenCalledTimes(1);
    });

    test('calls callback immediately on single call with trailing: false', () => {
        const callback = jest.fn();
        const { result } = setup(callback, DELAY_THROTTLE, { trailing: false });

        act(() => {
            result.current();
        });

        expect(callback).toHaveBeenCalled();

        jest.advanceTimersByTime(DELAY_THROTTLE);

        expect(callback).toHaveBeenCalledTimes(1);
    });

    test('should not call the callback at all with leading: false and trailing: false', () => {
        const callback = jest.fn();
        const { result } = setup(callback, DELAY_THROTTLE, { leading: false, trailing: false });

        multipleCalls(result.current, DELAY_THROTTLE);

        expect(callback).not.toHaveBeenCalled();
    });

    test('should call the callback with the latest arguments after the delay', () => {
        const callback = jest.fn();
        const { result } = setup(callback, DELAY_THROTTLE);

        act(() => {
            result.current('arg-1');
        });

        act(() => {
            result.current('arg-2');
        });

        expect(callback).toHaveBeenCalledWith('arg-1');

        jest.advanceTimersByTime(DELAY_THROTTLE);

        expect(callback).toHaveBeenCalledWith('arg-1');
        expect(callback).toHaveBeenCalledWith('arg-2');
    });

    test('should clean up timer on unmount', () => {
        jest.spyOn(global, 'clearTimeout');

        const callback = jest.fn();
        const { result, unmount } = setup(callback, DELAY_THROTTLE);

        act(() => {
            result.current();
            result.current();
            result.current();
        });

        expect(callback).toHaveBeenCalled();

        unmount();

        jest.advanceTimersByTime(DELAY_THROTTLE);

        expect(callback).toHaveBeenCalledTimes(1);
        expect(clearTimeout).toHaveBeenCalled();
    });
});
