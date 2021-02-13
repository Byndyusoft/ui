import { renderHook, act } from '@testing-library/react-hooks';
import useBoolean from './useBoolean';

describe('hooks/useBoolean', () => {
    test('initializes with default value (false)', () => {
        const { result } = renderHook(() => useBoolean());

        expect(result.current[0]).toEqual(false);
    });

    test('initializes with true', () => {
        const { result } = renderHook(() => useBoolean(true));

        expect(result.current[0]).toEqual(true);
    });

    test('initializes with false', () => {
        const { result } = renderHook(() => useBoolean(false));

        expect(result.current[0]).toEqual(false);
    });

    test('initializes with function returning true', () => {
        const { result } = renderHook(() => useBoolean(() => true));

        expect(result.current[0]).toEqual(true);
    });

    test('initializes with function returning false', () => {
        const { result } = renderHook(() => useBoolean(() => false));

        expect(result.current[0]).toEqual(false);
    });

    test('toggles to true', () => {
        const { result } = renderHook(() => useBoolean(false));

        const [, { toTrue }] = result.current;

        act(() => {
            toTrue();
        });

        expect(result.current[0]).toEqual(true);

        act(() => {
            toTrue();
        });

        expect(result.current[0]).toEqual(true);
    });

    test('toggles to false', () => {
        const { result } = renderHook(() => useBoolean(true));

        const [, { toFalse }] = result.current;

        act(() => {
            toFalse();
        });

        expect(result.current[0]).toEqual(false);

        act(() => {
            toFalse();
        });

        expect(result.current[0]).toEqual(false);
    });

    test('toggles', () => {
        const { result } = renderHook(() => useBoolean(true));

        const [, { toggle }] = result.current;

        act(() => {
            toggle();
        });

        expect(result.current[0]).toEqual(false);

        act(() => {
            toggle();
        });

        expect(result.current[0]).toEqual(true);
    });
});
