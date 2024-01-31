import { act, renderHook } from '@testing-library/react-hooks';
import useArray from './useArray';

describe('hooks/useArray', () => {
    it('should return the initial value', () => {
        const initialValue = [1, 2, 3];
        const { result } = renderHook(() => useArray(initialValue));
        expect(result.current.list).toEqual(initialValue);
    });

    it('should append an item to the list', () => {
        const initialValue = [1, 2, 3];
        const { result } = renderHook(() => useArray(initialValue));
        const newItem = 4;
        act(() => {
            result.current.append(newItem);
        });
        expect(result.current.list).toEqual([1, 2, 3, newItem]);
    });

    it('should prepend an item to the list', () => {
        const initialValue = [1, 2, 3];
        const { result } = renderHook(() => useArray(initialValue));
        const newItem = 0;
        act(() => {
            result.current.prepend(newItem);
        });
        expect(result.current.list).toEqual([newItem, 1, 2, 3]);
    });

    it('should filter the list', () => {
        const initialValue = [1, 2, 3, 4, 5];
        const { result } = renderHook(() => useArray(initialValue));
        act(() => {
            result.current.filter(item => item % 2 === 0);
        });
        expect(result.current.list).toEqual([2, 4]);
    });

    it('should sort the list', () => {
        const initialValue = [3, 1, 5, 2, 4];
        const { result } = renderHook(() => useArray(initialValue));
        act(() => {
            result.current.sort((a, b) => a - b);
        });
        expect(result.current.list).toEqual([1, 2, 3, 4, 5]);
    });

    it('should clear the list', () => {
        const initialValue = [1, 2, 3];
        const { result } = renderHook(() => useArray(initialValue));
        act(() => {
            result.current.clear();
        });
        expect(result.current.list).toEqual([]);
    });

    it('should reset the list to the initial value', () => {
        const initialValue = [1, 2, 3];
        const { result } = renderHook(() => useArray(initialValue));
        act(() => {
            result.current.append(4);
            result.current.reset();
        });
        expect(result.current.list).toEqual(initialValue);
    });
});
