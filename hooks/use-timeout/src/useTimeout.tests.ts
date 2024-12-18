import { Callback } from '@byndyusoft-ui/types';
import { Renderer, renderHook, RenderHookResult } from '@testing-library/react-hooks';
import useTimeout, { IUseTimeout } from './useTimeout';

const setup = (callback: Callback, delay: number): RenderHookResult<void, IUseTimeout, Renderer<void>> =>
    renderHook(() => useTimeout(callback, delay));

describe('hooks/useTimeout', () => {
    beforeAll(() => {
        jest.useFakeTimers();
        jest.spyOn(global, 'clearTimeout');
    });

    test('calls callback', () => {
        const callback = jest.fn();

        const { result } = setup(callback, 100);

        result.current.start();

        expect(callback).not.toBeCalled();

        jest.advanceTimersByTime(150);

        expect(callback).toHaveBeenCalledTimes(1);
    });

    test('should not call the callback if start is not called', () => {
        const callback = jest.fn();

        setup(callback, 100);

        expect(callback).not.toBeCalled();

        jest.advanceTimersByTime(150);

        expect(callback).not.toBeCalled();
    });

    test('should clear the timer and not call the callback when stop is called after start', () => {
        const callback = jest.fn();

        const { result } = setup(callback, 100);

        result.current.start();

        expect(clearTimeout).toHaveBeenCalledTimes(0);

        expect(callback).not.toBeCalled();

        result.current.stop();

        jest.advanceTimersByTime(150);

        expect(callback).toHaveBeenCalledTimes(0);
        expect(clearTimeout).toHaveBeenCalledTimes(1);
    });
});
