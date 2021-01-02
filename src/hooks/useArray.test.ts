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

        const [, , { append }] = result.current;

        act(() => {
            append(5);
        });

        expect(result.current[0]).toEqual([1, 2, 3, 4, 5]);
    });

    test('prepends item to array', () => {
        const { result } = renderHook(() => useArray<number>(() => [1, 2, 3, 4]));

        const [, , { prepend }] = result.current;

        act(() => {
            prepend(0);
        });

        expect(result.current[0]).toEqual([0, 1, 2, 3, 4]);
    });

    test('clears array', () => {
        const { result } = renderHook(() => useArray<number>(() => [1, 2, 3, 4]));

        const [, , { clear }] = result.current;

        act(() => {
            clear();
        });

        expect(result.current[0]).toEqual([]);
    });

    test('removes item by index', () => {
        const { result } = renderHook(() => useArray<number>(() => [1, 2, 3, 4]));

        const [, , { remove }] = result.current;

        act(() => {
            remove(2);
        });

        expect(result.current[0]).toEqual([1, 2, 4]);
    });

    test('inserts item by index', () => {
        const { result } = renderHook(() => useArray<number>(() => [1, 2, 3, 4]));

        const [, , { insert }] = result.current;

        act(() => {
            insert(2, 2.5);
        });

        expect(result.current[0]).toEqual([1, 2, 2.5, 3, 4]);
    });

    test('sorts array', () => {
        const { result } = renderHook(() => useArray<number>(() => [1, 2, 3, 4]));

        const [, , { sort }] = result.current;

        act(() => {
            sort((left, right) => right - left);
        });

        expect(result.current[0]).toEqual([4, 3, 2, 1]);
    });

    test('updates item by index', () => {
        const { result } = renderHook(() => useArray<number>(() => [1, 2, 3, 4]));

        const [, , { update }] = result.current;

        act(() => {
            update(2, 2.5);
        });

        expect(result.current[0]).toEqual([1, 2, 2.5, 4]);
    });

    test('filters array', () => {
        const { result } = renderHook(() => useArray<number>(() => [1, 2, 3, 4]));

        const [, , { filter }] = result.current;

        act(() => {
            filter(item => Boolean(item % 2));
        });

        expect(result.current[0]).toEqual([1, 3]);
    });

    test('resets array to initial value', () => {
        const { result } = renderHook(() => useArray<number>(() => [1, 2, 3, 4]));

        const [, setArray, { reset }] = result.current;

        act(() => {
            setArray([5, 6, 7, 8]);
        });

        expect(result.current[0]).toEqual([5, 6, 7, 8]);

        act(() => {
            reset();
        });

        expect(result.current[0]).toEqual([1, 2, 3, 4]);
    });
});
