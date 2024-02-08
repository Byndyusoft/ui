import { act, renderHook } from '@testing-library/react-hooks';
import useArray from './useArray';

describe('hooks/useArray', () => {
    it('should return the initial value', () => {
        const initialValue = [1, 2, 3];
        const { result } = renderHook(() => useArray(initialValue));
        expect(result.current[0]).toEqual(initialValue);
    });

    it('should append an item to the list', () => {
        const initialValue = [1, 2, 3];
        const { result } = renderHook(() => useArray(initialValue));
        const [, { append }] = result.current;
        const newItem = 4;
        act(() => {
            append(newItem);
        });
        expect(result.current[0]).toEqual([1, 2, 3, newItem]);
    });

    it('should prepend an item to the list', () => {
        const initialValue = [1, 2, 3];
        const { result } = renderHook(() => useArray(initialValue));
        const [, { prepend }] = result.current;
        const newItem = 0;
        act(() => {
            prepend(newItem);
        });
        expect(result.current[0]).toEqual([newItem, 1, 2, 3]);
    });

    it('should update item in list', () => {
        const initialValue = [1, 2, 3];
        const { result } = renderHook(() => useArray<string | number>(initialValue));
        const [, { update }] = result.current;
        act(() => {
            update(1, 'two');
        });
        expect(result.current[0]).toEqual([1, 'two', 3]);
    });

    it('should remove item from list', () => {
        const initialValue = [1, 2, 3];
        const { result } = renderHook(() => useArray(initialValue));
        const [, { remove }] = result.current;
        act(() => {
            remove(1);
        });
        expect(result.current[0]).toEqual([1, 3]);
    });

    it('should filter the list', () => {
        const initialValue = [1, 2, 3, 4, 5];
        const { result } = renderHook(() => useArray(initialValue));
        const [, { filter }] = result.current;
        act(() => {
            filter(item => item % 2 === 0);
        });
        expect(result.current[0]).toEqual([2, 4]);
    });

    it('should sort the list', () => {
        const initialValue = [3, 1, 5, 2, 4];
        const { result } = renderHook(() => useArray(initialValue));
        const [, { sort }] = result.current;
        act(() => {
            sort((a, b) => a - b);
        });
        expect(result.current[0]).toEqual([1, 2, 3, 4, 5]);
    });

    it('should clear the list', () => {
        const initialValue = [1, 2, 3];
        const { result } = renderHook(() => useArray(initialValue));
        const [, { clear }] = result.current;
        act(() => {
            clear();
        });
        expect(result.current[0]).toEqual([]);
    });

    it('should reset the list to the initial value', () => {
        const initialValue = [1, 2, 3];
        const { result } = renderHook(() => useArray(initialValue));
        const [, { append, reset }] = result.current;
        act(() => {
            append(4);
            reset();
        });
        expect(result.current[0]).toEqual(initialValue);
    });
});
