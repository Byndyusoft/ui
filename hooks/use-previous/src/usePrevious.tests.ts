import { Renderer, renderHook, RenderHookResult } from '@testing-library/react-hooks';
import usePrevious from './usePrevious';

const setup = (value?: unknown): RenderHookResult<unknown, unknown, Renderer<unknown>> =>
    renderHook(state => usePrevious(state), { initialProps: value });

describe('hooks/usePrevious', () => {
    test('returns undefined on initial render', () => {
        const { result } = setup();

        expect(result.current).toBeUndefined();
    });

    test('always returns previous state after each update', () => {
        const { result, rerender } = setup(1);

        rerender(2);
        expect(result.current).toBe(1);

        rerender(3);
        expect(result.current).toBe(2);

        rerender(4);
        expect(result.current).toBe(3);
    });
});
