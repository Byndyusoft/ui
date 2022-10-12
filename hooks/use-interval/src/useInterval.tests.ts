import { renderHook } from '@testing-library/react-hooks';
import useInterval from './useInterval';

const setup = (callback: () => void, delay: number | null) => renderHook(() => useInterval(callback, delay));

describe('hooks/useInterval', () => {
    beforeAll(() => {
        jest.useFakeTimers();
        jest.spyOn(global, 'clearInterval');
    });

    test('calls callback', () => {
        const callback = jest.fn();

        setup(callback, 100);

        expect(callback).not.toBeCalled();

        jest.advanceTimersByTime(101);

        expect(callback).toHaveBeenCalledTimes(1);

        jest.advanceTimersByTime(100);

        expect(callback).toHaveBeenCalledTimes(2);

        jest.advanceTimersByTime(100);

        expect(callback).toHaveBeenCalledTimes(3);
    });

    test('does not call callback if delay is null', () => {
        const callback = jest.fn();

        setup(callback, null);

        expect(callback).not.toBeCalled();

        jest.advanceTimersByTime(150);

        expect(callback).not.toBeCalled();
    });

    test('clears interval', () => {
        const callback = jest.fn();

        const { result } = setup(callback, 100);
        expect(clearInterval).toHaveBeenCalledTimes(0);

        expect(callback).not.toBeCalled();

        result.current();

        jest.advanceTimersByTime(150);

        expect(callback).toHaveBeenCalledTimes(0);
        expect(clearInterval).toHaveBeenCalledTimes(1);
    });
});
