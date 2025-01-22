import { waitFor } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react-hooks';
import useDebouncedCallback from './useDebouncedCallback';

const oldValue = 'old value';
const newValue = 'new value';

describe('hooks/useDebouncedCallback', () => {
    test('works correctly with one handler call', async () => {
        let value = oldValue;
        const handle = () => (value = newValue);
        const { result } = renderHook(() => useDebouncedCallback(handle, 1000));
        const setDebounceValue = result.current;

        act(setDebounceValue);

        expect(value).toEqual(oldValue);

        await waitFor(
            () => {
                expect(value).toEqual(oldValue);
            },
            { timeout: 500 }
        );

        await waitFor(
            () => {
                expect(value).toEqual(newValue);
            },
            { timeout: 1500 }
        );
    });

    test('works correctly with several handler calls', async () => {
        const handle = jest.fn();
        const { result } = renderHook(() => useDebouncedCallback(handle, 500));
        const setDebounceValue = result.current;

        act(() => {
            setDebounceValue();
            setDebounceValue();
        });

        await waitFor(
            () => {
                expect(handle).toBeCalledTimes(1);
            },
            { timeout: 1000 }
        );

        act(() => {
            setDebounceValue();
            setDebounceValue();
            setDebounceValue();
        });

        await waitFor(
            () => {
                expect(handle).toBeCalledTimes(2);
            },
            { timeout: 1000 }
        );
    });

    test('cleans up timer on unmount', async () => {
        const handle = jest.fn();
        const { result, unmount } = renderHook(() => useDebouncedCallback(handle, 500));
        const setDebounceValue = result.current;

        act(() => {
            setDebounceValue();
        });

        unmount();

        await waitFor(
            () => {
                expect(handle).not.toBeCalled();
            },
            { timeout: 600 }
        );
    });

    test('uses the latest callback after it changes', async () => {
        let value = '';

        const { result, rerender } = renderHook(({ callback }) => useDebouncedCallback(callback, 500), {
            initialProps: { callback: () => (value = oldValue) }
        });

        const setDebounceValue = result.current;

        act(() => {
            setDebounceValue();
        });

        rerender({ callback: () => (value = newValue) });

        await waitFor(
            () => {
                expect(value).toEqual(newValue);
            },
            { timeout: 600 }
        );
    });

    test('executes callback immediately with delay = 0', async () => {
        const handle = jest.fn();
        const { result } = renderHook(() => useDebouncedCallback(handle, 0));
        const setDebounceValue = result.current;

        act(() => {
            setDebounceValue();
        });

        await waitFor(
            () => {
                expect(handle).toBeCalledTimes(1);
            },
            { timeout: 100 }
        );
    });

    test('cancels previous timer before starting a new one', async () => {
        const handle = jest.fn();
        const { result } = renderHook(() => useDebouncedCallback(handle, 500));
        const setDebounceValue = result.current;

        act(() => {
            setDebounceValue();
        });

        await waitFor(
            () => {
                expect(handle).not.toBeCalled();
            },
            { timeout: 300 }
        );

        act(() => {
            setDebounceValue();
        });

        await waitFor(
            () => {
                expect(handle).toBeCalledTimes(1);
            },
            { timeout: 600 }
        );
    });

    test('adjusts to updated delay value', async () => {
        const handle = jest.fn();
        const { result, rerender } = renderHook(({ delay }) => useDebouncedCallback(handle, delay), {
            initialProps: { delay: 500 }
        });
        const setDebounceValue = result.current;

        act(() => {
            setDebounceValue();
        });

        rerender({ delay: 1000 });

        act(() => {
            setDebounceValue();
        });

        await waitFor(
            () => {
                expect(handle).not.toBeCalled();
            },
            { timeout: 750 }
        );

        await waitFor(
            () => {
                expect(handle).toBeCalledTimes(1);
            },
            { timeout: 750 }
        );
    });

    test('ensure no unnecessary rerenders when dependency is omitted', async () => {
        const handle = jest.fn();
        const { result } = renderHook(() => useDebouncedCallback(handle, 500));

        act(() => {
            result.current(oldValue);
        });

        await waitFor(
            () => {
                expect(handle).toHaveBeenCalledWith(oldValue);
                expect(handle).toHaveBeenCalledTimes(1);
            },
            { timeout: 600 }
        );

        act(() => {
            result.current(newValue);
        });

        await waitFor(
            () => {
                expect(handle).toHaveBeenCalledWith(newValue);
                expect(handle).toHaveBeenCalledTimes(2);
            },
            { timeout: 600 }
        );
    });

    test('should update the debounced function when delay changes', async () => {
        const handle = jest.fn();
        const { result, rerender } = renderHook(({ callback, delay }) => useDebouncedCallback(callback, delay), {
            initialProps: { callback: handle, delay: 1000 }
        });

        rerender({ delay: 500, callback: handle });

        act(() => {
            result.current(oldValue);
        });

        expect(handle).not.toHaveBeenCalled();

        act(() => {
            result.current(newValue);
        });

        await waitFor(
            () => {
                expect(handle).toHaveBeenCalledWith(newValue);
                expect(handle).toHaveBeenCalledTimes(1);
            },
            { timeout: 600 }
        );
    });

    test('should update the debounced function when callback changes', async () => {
        const oldHandle = jest.fn();
        const newHandle = jest.fn();

        const { result, rerender } = renderHook(({ callback, delay }) => useDebouncedCallback(callback, delay), {
            initialProps: { callback: oldHandle, delay: 500 }
        });

        rerender({ delay: 500, callback: newHandle });

        act(() => {
            result.current(oldValue);
        });

        expect(oldHandle).not.toHaveBeenCalled();

        act(() => {
            result.current(newValue);
        });

        await waitFor(
            () => {
                expect(newHandle).toHaveBeenCalledWith(newValue);
                expect(newHandle).toHaveBeenCalledTimes(1);
                expect(oldHandle).not.toBeCalled();
            },
            { timeout: 600 }
        );
    });
});
