import React, { FC, createContext, useContext } from 'react';
import { render, screen, act as actReact, act } from '@testing-library/react';
import { renderHook, act as actHook } from '@testing-library/react-hooks';
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
        actHook(() => {
            const [, setUserData] = result.current;

            setUserData('test');
        });

        const [userData] = result.current;

        expect(userData).toBeDefined();
    });

    test('useLocalStorage cleaning data is working', () => {
        const { result } = renderHook(() => useLocalStorage<string>(LOCALSTORAGE_KEY_TEST));

        // Set data
        actHook(() => {
            const [, setUserData] = result.current;

            setUserData('test');
        });

        // Check data
        actHook(() => {
            const [userData] = result.current;

            expect(userData).toBeDefined();
        });

        // Clear data
        actHook(() => {
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
    test('useLocalStorage clearing entire storage',() => {
        expect(localStorage.getItem('userData')).toBeNull();

        localStorage.setItem('userData','test');

        expect(localStorage.getItem('userData')).toBe('test');

        clearEntireLocalStorage();

        expect(localStorage.getItem('userData')).toBeNull();

    });

    test('useLocalStorage changing state everywhere with using context', () => {
        /* Arrange */

        let setUserDataAnchor : (value:string) => void = () => {
            // do nothing
        };

        // Context
        type TLocalStorageContext<T> = [data: T | null, setData: (value: T) => void, remove: () => void]
        type TLocalStorageStringContext = TLocalStorageContext<string>

        const LocalStorageContext = createContext<TLocalStorageStringContext>([null, () => {
            //do nothing
        }, () => {
            // do nothing
        }]);

        const LocalStorageProvider : FC = ({children}) => {
            const ctxValue = useLocalStorage<string>('userData');

            return <LocalStorageContext.Provider value={ctxValue}>
                {children}
                </LocalStorageContext.Provider>
        }

        // Component using context
        const SomeComponent : FC = () => {
            const [userData] = useContext(LocalStorageContext);

            return <input type="text" data-testid="someComponentInput" value={userData ?? ''} onChange={() => {
                // do nothing
            }} />
        }

        // Another component using context
        const AnotherComponent : FC = () => {
            const [userData, setUserData] = useContext(LocalStorageContext);

            setUserDataAnchor = setUserData;

            return <input type="text" data-testid="anotherComponentInput" value={userData ?? ''} onChange={() => {
                // do nothing
            }} />
        }

        // App
        const App : FC = () => <LocalStorageProvider>
            <SomeComponent/>
            <AnotherComponent />
        </LocalStorageProvider>;

        /* Act */
        render(<App />);

        const someComponentInput = screen.getByTestId('someComponentInput') as HTMLInputElement;
        const anotherComponentInput = screen.getByTestId('anotherComponentInput') as HTMLInputElement;

        /* Assert */
        expect(someComponentInput.value).toBe('');
        expect(anotherComponentInput.value).toBe('');

        actReact(() => {
            setUserDataAnchor('test');
        })

        expect(someComponentInput.value).toBe('test');
        expect(anotherComponentInput.value).toBe('test');
    });
});
