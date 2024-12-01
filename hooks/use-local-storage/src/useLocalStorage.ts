import { useState } from 'react';
import * as localStorage from '@byndyusoft-ui/local-storage';

export interface IUseLocalStorageActions<TValue> {
    setValue: (value: TValue) => void;
    removeValue: () => boolean;
}

export interface IUseLocalStorageOptions<TValue> {
    serialize: (value: TValue) => string;
    deserialize: (raw: string) => TValue;
}

export type TUseLocalStorage<TValue> = [TValue, IUseLocalStorageActions<TValue>];

export default function useLocalStorage<TValue>(
    key: string,
    defaultValue: TValue,
    options?: IUseLocalStorageOptions<TValue>
): TUseLocalStorage<TValue> {
    const [storedValue, setStoredValue] = useState<TValue>(() =>
        localStorage.getValue(key, defaultValue, options?.deserialize)
    );

    const setValue = (nextValue: TValue): void => {
        localStorage.setValue(key, nextValue, options?.serialize);
        setStoredValue(nextValue);
    };

    const removeValue = (): boolean => {
        return true;
    };

    return [storedValue, { setValue, removeValue }];
}
