import { waitFor } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react-hooks';
import useDebouncedValue from './useDebouncedValue';

const oldValue = 'old value';
const newValue = 'new value';
const timeout = 2000;

describe('hooks/useDebouncedValue', () => {
    test('useDebouncedValue works', () => {
        const { result } = renderHook(() => useDebouncedValue(oldValue, timeout));
        const [debouncedValue, setDebouncedValue] = result.current;
        expect(debouncedValue).toEqual(oldValue);
        act(() => {
            setDebouncedValue(newValue);
        });
        expect(debouncedValue).toEqual(oldValue);
        waitFor(
            () => {
                expect(debouncedValue).toEqual(newValue);
            },
            { timeout: 2500 }
        );
    });
});
