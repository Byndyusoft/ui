import { renderHook } from '@testing-library/react-hooks';
import useTimeout from './useTimeout';

const setup = (callback: () => void, delay: number | null) => renderHook(() => useTimeout(callback, delay));

describe('hooks/useTimeout', () => {
    beforeAll(() => {
        jest.useFakeTimers();
        jest.spyOn(global, 'clearTimeout');
    });

    test('calls callback', () => {
        const callback = jest.fn();

        setup(callback, 100);

        expect(callback).not.toBeCalled();

        jest.advanceTimersByTime(150);

        expect(callback).toHaveBeenCalledTimes(1);
    });

    test('does not call callback if delay is null', () => {
        const callback = jest.fn();

        setup(callback, null);

        expect(callback).not.toBeCalled();

        jest.advanceTimersByTime(150);

        expect(callback).not.toBeCalled();
    });
});
