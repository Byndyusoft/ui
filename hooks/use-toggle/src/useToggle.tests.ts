import { renderHook, act } from '@testing-library/react-hooks';
import useToggle from './useToggle';

describe('hooks/useToggle', () => {
    test('initializes with true', () => {
        const { result } = renderHook(() => useToggle(true, false, true));

        expect(result.current[0]).toEqual(true);
    });

    test('initializes with false', () => {
        const { result } = renderHook(() => useToggle(true, false, false));

        expect(result.current[0]).toEqual(false);
    });

    test('initializes with function returning true', () => {
        const { result } = renderHook(() => useToggle(true, false, () => true));

        expect(result.current[0]).toEqual(true);
    });

    test('initializes with function returning false', () => {
        const { result } = renderHook(() => useToggle(true, false, () => false));

        expect(result.current[0]).toEqual(false);
    });

    test('toggles to left value', () => {
        const { result } = renderHook(() => useToggle(true, false, false));

        const [, { toLeftValue }] = result.current;

        act(() => {
            toLeftValue();
        });

        expect(result.current[0]).toEqual(true);

        act(() => {
            toLeftValue();
        });

        expect(result.current[0]).toEqual(true);
    });

    test('toggles to right value', () => {
        const { result } = renderHook(() => useToggle(true, false, () => true));

        const [, { toRightValue }] = result.current;

        act(() => {
            toRightValue();
        });

        expect(result.current[0]).toEqual(false);

        act(() => {
            toRightValue();
        });

        expect(result.current[0]).toEqual(false);
    });

    test('toggles', () => {
        const { result } = renderHook(() => useToggle(true, false, true));

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
