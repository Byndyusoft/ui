import { renderHook, } from '@testing-library/react';
import useLatestRef from './useLatestRef';

const setup = <T>(value?: T) =>
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
