import { act, renderHook } from '@testing-library/react-hooks';
import useLocalStorage from './useLocalStorage';

describe('hooks/useLocalStorage', () => {
    const KEY = 'ls-test-key';

    beforeEach(() => {
        window.localStorage.clear();
    });

    test('initializes with default value when storage is empty', () => {
        const { result } = renderHook(() => useLocalStorage(KEY, 'default'));

        expect(result.current[0]).toBe('default');
    });

    test('reads existing value from localStorage on init', () => {
        window.localStorage.setItem(KEY, JSON.stringify('stored'));

        const { result } = renderHook(() => useLocalStorage(KEY, 'default'));

        expect(result.current[0]).toBe('stored');
    });

    test('setValue updates state and writes to localStorage', () => {
        const { result } = renderHook(() => useLocalStorage(KEY, 'default'));

        act(() => {
            result.current[1].setValue('next');
        });

        expect(result.current[0]).toBe('next');
        expect(window.localStorage.getItem(KEY)).toBe(JSON.stringify('next'));
    });

    test('removeValue clears storage and resets to default', () => {
        window.localStorage.setItem(KEY, JSON.stringify('stored'));

        const { result } = renderHook(() => useLocalStorage(KEY, 'default'));

        act(() => {
            result.current[1].removeValue();
        });

        expect(result.current[0]).toBe('default');
        expect(window.localStorage.getItem(KEY)).toBeNull();
    });

    test('respects custom serializer and deserializer from options', () => {
        const serialize = vi.fn((value: { foo: string }) => `(${value.foo})`);
        const deserialize = vi.fn((raw: string) => ({ foo: raw.slice(1, -1) }));

        window.localStorage.setItem(KEY, '(baz)');

        const { result, rerender } = renderHook(
            (props: { initial: { foo: string } }) =>
                useLocalStorage<{ foo: string }>(KEY, props.initial, { serialize, deserialize }),
            {
                initialProps: { initial: { foo: 'default' } }
            }
        );

        expect(deserialize).toHaveBeenCalledWith('(baz)');

        act(() => {
            result.current[1].setValue({ foo: 'bar' });
        });

        expect(window.localStorage.getItem(KEY)).toBe('(bar)');

        expect(serialize).toHaveBeenCalledWith({ foo: 'bar' });
    });

    test('updates value when storage event for the same key and same storage area is dispatched', () => {
        const { result } = renderHook(() => useLocalStorage(KEY, 'default'));

        const event = new Event('storage') as StorageEvent;
        (event as any).key = KEY;
        (event as any).newValue = JSON.stringify('from-event');
        (event as any).storageArea = window.localStorage;

        act(() => {
            window.dispatchEvent(event);
        });

        expect(result.current[0]).toBe('from-event');
    });

    test('do not update value when storage event for the same key and other storage area is dispatched (syncTab = false)', () => {
        const { result } = renderHook(() => useLocalStorage(KEY, 'default'));

        const event = new Event('storage') as StorageEvent;
        (event as any).key = KEY;
        (event as any).newValue = JSON.stringify('from-event');
        (event as any).storageArea = {} as Storage;

        act(() => {
            window.dispatchEvent(event);
        });

        expect(result.current[0]).toBe('default');
    });

    test('do not update value when storage event for the other key and same storage area is dispatched (syncTab = false)', () => {
        const { result } = renderHook(() => useLocalStorage(KEY, 'default'));

        const event = new Event('storage') as StorageEvent;
        (event as any).key = 'other-key';
        (event as any).newValue = JSON.stringify('from-event');
        (event as any).storageArea = window.localStorage;

        act(() => {
            window.dispatchEvent(event);
        });

        expect(result.current[0]).toBe('default');
    });

    test('updates value when storage event for the same key and other storage area is dispatched (syncTab = true)', () => {
        const { result } = renderHook(() => useLocalStorage(KEY, 'default', { syncTabs: true }));

        const event = new Event('storage') as StorageEvent;
        (event as any).key = KEY;
        (event as any).newValue = JSON.stringify('from-event');
        (event as any).storageArea = {} as Storage;

        act(() => {
            window.dispatchEvent(event);
        });

        expect(result.current[0]).toBe('from-event');
    });
});
