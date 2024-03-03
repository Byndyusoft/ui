import { Renderer, renderHook, RenderHookResult } from '@testing-library/react-hooks';
import useLatestRef from './useLatestRef';
import { MutableRefObject } from 'react';

const setup = <T>(value?: T): RenderHookResult<T, MutableRefObject<T>, Renderer<T>> =>
    renderHook(state => useLatestRef(state), { initialProps: value });

describe('hooks/useLatestRef', () => {
    test('persists value between renders', () => {
        const { result, rerender } = setup(0);

        rerender(1);
        expect(result.current.current).toEqual(1);

        rerender(2);
        expect(result.current.current).toEqual(2);

        rerender(3);
        expect(result.current.current).toEqual(3);
    });
});
