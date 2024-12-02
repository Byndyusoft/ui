import { waitFor } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react-hooks';
import useDebouncedCallback from './useDebouncedCallback';

const oldValue = 'old value';
const newValue = 'new value';

describe('hooks/useDebouncedCallback', () => {
    test('works correctly with one handler call', async () => {
        let value = oldValue;
        const handle = () => (value = newValue);
        const { result } = renderHook(() => useDebouncedCallback(handle, 2000));
        const setDebounceValue = result.current;

        act(setDebounceValue);

        expect(value).toEqual(oldValue);

        await waitFor(
            () => {
                expect(value).toEqual(oldValue);
            },
            { timeout: 1000 }
        );

        await waitFor(
            () => {
                expect(value).toEqual(newValue);
            },
            { timeout: 2500 }
        );
    });

    test('works correctly with several handler calls', async () => {
        const handle = jest.fn();
        const { result } = renderHook(() => useDebouncedCallback(handle, 2000));
        const setDebounceValue = result.current;

        act(setDebounceValue);
        act(setDebounceValue);

        await waitFor(
            () => {
                expect(handle).toBeCalledTimes(1);
            },
            { timeout: 2500 }
        );

        act(setDebounceValue);
        act(setDebounceValue);

        await waitFor(
            () => {
                expect(handle).toBeCalledTimes(2);
            },
            { timeout: 2500 }
        );
    });
});
