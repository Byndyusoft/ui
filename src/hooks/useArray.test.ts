import { renderHook } from '@testing-library/react-hooks';
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
});
