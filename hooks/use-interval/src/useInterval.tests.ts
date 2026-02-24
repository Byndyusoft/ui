import { Renderer, renderHook, RenderHookResult } from '@testing-library/react-hooks';
import { Callback, Nullable } from '@byndyusoft-ui/types';
import useInterval, { IUseInterval } from './useInterval';

const setup = (callback: Callback, delay: Nullable<number>): RenderHookResult<void, IUseInterval, Renderer<void>> =>
    renderHook(() => useInterval(callback, delay));

describe('hooks/useInterval', () => {
    beforeAll(() => {
        vi.useFakeTimers();
    });

    test('calls callback', () => {
        const callback = vi.fn();
        const delay = 100;

        const { result } = setup(callback, delay);

        expect(callback).not.toBeCalled();

        result.current.start();

        vi.advanceTimersByTime(101);

        expect(callback).toHaveBeenCalledTimes(1);

        vi.advanceTimersByTime(100);

        expect(callback).toHaveBeenCalledTimes(2);

        vi.advanceTimersByTime(100);

        expect(callback).toHaveBeenCalledTimes(3);
    });

    test('does not call callback if delay is null', () => {
        const callback = vi.fn();
        const delay = null;

        setup(callback, delay);

        expect(callback).not.toBeCalled();

        vi.advanceTimersByTime(150);

        expect(callback).not.toBeCalled();
    });

    test('stops interval', () => {
        vi.spyOn(global, 'clearInterval');
        const callback = vi.fn();
        const delay = 100;

        const { result } = setup(callback, delay);
        expect(clearInterval).toHaveBeenCalledTimes(0);

        expect(callback).not.toBeCalled();

        result.current.start();

        vi.advanceTimersByTime(delay + 1);

        expect(callback).toHaveBeenCalledTimes(1);

        result.current.stop();

        vi.advanceTimersByTime(delay + 1);

        expect(callback).toHaveBeenCalledTimes(1);
        expect(clearInterval).toHaveBeenCalledTimes(1);
    });
});
