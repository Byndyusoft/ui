import { renderHook, act } from '@testing-library/react-hooks';
import useThrottle, { IThrottleOptions } from './useThrottle';

const setup = (callback: jest.Mock, delay: number, options?: IThrottleOptions) => {
    const { result } = renderHook(() => useThrottle(callback, delay, options));
    return result;
};

const multipleCalls = (callback: () => void) => {
    act(() => {
        callback();
        callback();
        callback();
    });
    jest.advanceTimersByTime(1000);
    act(() => {
        callback();
    });
    jest.advanceTimersByTime(1000);
    act(() => {
        callback();
        callback();
        callback();
    });
    jest.advanceTimersByTime(1000);
};

describe('hook/useThrottle', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.clearAllTimers();
    });

    test('should be called correctly', () => {
        const callback = jest.fn();
        const result = setup(callback, 1000);

        multipleCalls(result.current);

        expect(callback).toHaveBeenCalledTimes(4);
    });

    test('should not call the callback immediately with leading: false', () => {
        const callback = jest.fn();
        const result = setup(callback, 1000, { leading: false });

        act(() => {
            result.current();
            result.current();
            result.current();
        });

        expect(callback).not.toHaveBeenCalled();

        jest.advanceTimersByTime(1000);

        expect(callback).toHaveBeenCalledTimes(1);
    });

    test('should not call the callback after the delay with trailing: false', () => {
        const callback = jest.fn();
        const result = setup(callback, 1000, { trailing: false });

        act(() => {
            result.current();
            result.current();
            result.current();
        });

        expect(callback).toHaveBeenCalled();

        jest.advanceTimersByTime(1000);

        expect(callback).toHaveBeenCalledTimes(1);
    });

    test('should not call the callback at all with leading: false and trailing: false', () => {
        const callback = jest.fn();
        const result = setup(callback, 1000, { leading: false, trailing: false });

        multipleCalls(result.current);

        expect(callback).not.toHaveBeenCalled();
    });

    test('should call the callback with the latest arguments after the delay', () => {
        const callback = jest.fn();
        const result = setup(callback, 1000);

        act(() => {
            result.current('arg-1');
        });

        act(() => {
            result.current('arg-2');
        });

        jest.advanceTimersByTime(1000);

        expect(callback).toHaveBeenCalledWith('arg-2');
    });
});
