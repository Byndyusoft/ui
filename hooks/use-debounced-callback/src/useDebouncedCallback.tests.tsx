import { waitFor } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react-hooks';
import useDebouncedCallback from './useDebouncedCallback';

const oldValue = 'old value';
const newValue = 'new value';
const timeout = 2000;

describe('hooks/useDebouncedCallback', () => {
    test('useDebouncedCallback works', () => {
        let value = oldValue;
        const handle = () => (value = newValue);
        const { result } = renderHook(() => useDebouncedCallback(handle, timeout));
        const setDebounceValue = result.current;
        act(() => {
            setDebounceValue();
        });

        expect(value).toEqual(oldValue);
        waitFor(
            () => {
                expect(value).toEqual(newValue);
            },
            { timeout: 2500 }
        );
    });
});
