import { renderHook, act } from '@testing-library/react-hooks';
import useToggle from './useToggle';

describe('hooks/useToggle', () => {
    test('initializes with default value', () => {
        const { result } = renderHook(() => useToggle());

        expect(result.current[0]).toEqual(false);
    });

    test('initializes with true', () => {
        const { result } = renderHook(() => useToggle(true));

        expect(result.current[0]).toEqual(true);
    });

    test('initializes with false', () => {
        const { result } = renderHook(() => useToggle(false));

        expect(result.current[0]).toEqual(false);
    });

    test('initializes with function returning true', () => {
        const { result } = renderHook(() => useToggle(() => true));

        expect(result.current[0]).toEqual(true);
    });

    test('initializes with function returning false', () => {
        const { result } = renderHook(() => useToggle(() => false));

        expect(result.current[0]).toEqual(false);
    });

    test('toggles on', () => {
        const { result } = renderHook(() => useToggle(() => false));

        const [, { on }] = result.current;

        act(() => {
            on();
        });

        expect(result.current[0]).toEqual(true);

        act(() => {
            on();
        });

        expect(result.current[0]).toEqual(true);
    });

    test('toggles off', () => {
        const { result } = renderHook(() => useToggle(() => true));

        const [, { off }] = result.current;

        act(() => {
            off();
        });

        expect(result.current[0]).toEqual(false);

        act(() => {
            off();
        });

        expect(result.current[0]).toEqual(false);
    });

    test('toggles', () => {
        const { result } = renderHook(() => useToggle());

        const [, { toggle }] = result.current;

        act(() => {
            toggle();
        });

        expect(result.current[0]).toEqual(true);

        act(() => {
            toggle();
        });

        expect(result.current[0]).toEqual(false);
    });
});
