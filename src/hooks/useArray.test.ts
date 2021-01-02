import { renderHook, act } from '@testing-library/react-hooks';
import useArray from './useArray';

describe('hooks/useArray', () => {
    test('initializes with default value', () => {
        const { result } = renderHook(() => useArray());

        expect(result.current[0]).toEqual([]);
    });

    test('initializes with array of numbers', () => {
        const { result } = renderHook(() => useArray<number>([1, 2, 3, 4]));

        expect(result.current[0]).toEqual([1, 2, 3, 4]);
    });

    test('initializes with function returning array of numbers', () => {
        const { result } = renderHook(() => useArray<number>(() => [1, 2, 3, 4]));

        expect(result.current[0]).toEqual([1, 2, 3, 4]);
    });

    test('appends item to array', () => {
        const { result } = renderHook(() => useArray<number>(() => [1, 2, 3, 4]));

        const [, { append }] = result.current;

        act(() => {
            append(5);
        });

        expect(result.current[0]).toEqual([1, 2, 3, 4, 5]);
    });

    test('prepends item to array', () => {
        const { result } = renderHook(() => useArray<number>(() => [1, 2, 3, 4]));

        const [, { prepend }] = result.current;

        act(() => {
            prepend(0);
        });

        expect(result.current[0]).toEqual([0, 1, 2, 3, 4]);
    });

    test('clears array', () => {
        const { result } = renderHook(() => useArray<number>(() => [1, 2, 3, 4]));

        const [, { clear }] = result.current;

        act(() => {
            clear();
        });

        expect(result.current[0]).toEqual([]);
    });
});
