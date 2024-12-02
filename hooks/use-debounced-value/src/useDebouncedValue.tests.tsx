import { waitFor } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react-hooks';
import useDebouncedValue from './useDebouncedValue';

const oldValue = 'old value';
const newValue = 'new value';

describe('hooks/useDebouncedValue', () => {
    test('works correctly', async () => {
        const { result } = renderHook(() => useDebouncedValue(oldValue, 2000));
        const getCurrentDebouncedValue = () => result.current[0];
        const setDebouncedValue = result.current[1];

        expect(getCurrentDebouncedValue()).toEqual(oldValue);

        act(() => {
            setDebouncedValue(newValue);
        });

        expect(getCurrentDebouncedValue()).toEqual(oldValue);

        await waitFor(
            () => {
                expect(getCurrentDebouncedValue()).toEqual(oldValue);
            },
            { timeout: 1500 }
        );

        await waitFor(
            () => {
                expect(getCurrentDebouncedValue()).toEqual(newValue);
            },
            { timeout: 2500 }
        );
    });
});
