// import {render, act} from '@testing-library/react';
import { renderHook, act } from '@testing-library/react-hooks';
import useLocalStorage, { clearEntireLocalStorage } from './useLocalStorage';

const LOCALSTORAGE_KEY_TEST = 'userData';

beforeEach(() => {
    // Clear local storage before each test
    if ('localStorage' in window) {
        window.localStorage.removeItem(LOCALSTORAGE_KEY_TEST);
    } else {
        console.warn('localStorage is not defined for window');
    }
});

describe('hooks/useLocalStorage', () => {
    test('window.localStorage is defined', () => {
        expect(window.localStorage).toBeDefined();
    });

    test('useLocalStorage initial data is mounting', () => {
        const { result } = renderHook(() => useLocalStorage<string>(LOCALSTORAGE_KEY_TEST, 'test'));

        const [userData] = result.current;

        expect(userData).toBeDefined();
    });

    test('useLocalStorage not yet defined item is null', () => {
        const { result } = renderHook(() => useLocalStorage<string>(LOCALSTORAGE_KEY_TEST));
        const [userData] = result.current;

        expect(userData).toBeNull();
    });

    test('useLocalStorage set data is working', () => {
        const { result } = renderHook(() => useLocalStorage<string>(LOCALSTORAGE_KEY_TEST));

        // Set data
        act(() => {
            const [, setUserData] = result.current;

            setUserData('test');
        });

        const [userData] = result.current;

        expect(userData).toBeDefined();
    });

    test('useLocalStorage cleaning data is working', () => {
        const { result } = renderHook(() => useLocalStorage<string>(LOCALSTORAGE_KEY_TEST));

        // Set data
        act(() => {
            const [, setUserData] = result.current;

            setUserData('test');
        });

        // Check data
        act(() => {
            const [userData] = result.current;

            expect(userData).toBeDefined();
        });

        // Clear data
        act(() => {
            const [, , clearUserData] = result.current;

            clearUserData();
        });

        const [userData] = result.current;

        expect(userData).toBeNull();
    });

    /*
        Note:
            clearEntireLocalStorage is not updating any state
            because it is not available to subscribe for changes.
            You can only subscribe for watching changes from different pages(tabs).
    */
    test.todo('useLocalStorage clearing entire storage');

    test.todo('useLocalStorage changing state everywhere with using context');
});
