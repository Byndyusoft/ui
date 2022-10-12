import { renderHook } from '@testing-library/react-hooks';
import useLatestRef from './useLatestRef';

const setup = (value?: unknown) => renderHook(state => useLatestRef(state), { initialProps: value });

describe('hooks/useLatestRef', () => {
    test('persists value between renders', async () => {
        const { result, rerender } = setup(0);

        rerender(1);
        expect(result.current.current).toEqual(1);

        rerender(2);
        expect(result.current.current).toEqual(2);

        rerender(3);
        expect(result.current.current).toEqual(3);
    });
});
