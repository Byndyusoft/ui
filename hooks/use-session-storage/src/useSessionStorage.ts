import * as sessionStorageService from '@byndyusoft-ui/session-storage';
import { useState } from 'react';

export interface IUseSessionStorageActions<TValue> {
    setValue: (value: TValue) => void;
    removeValue: () => void;
}

export interface IUseSessionStorageOptions<TValue> {
    serialize: (value: TValue) => string;
    deserialize: (raw: string) => TValue;
}

export type TUseSessionStorage<TValue> = [TValue | null, IUseSessionStorageActions<TValue>];

export default function useSessionStorage<TValue>(
    key: string,
    defaultValue: TValue,
    options?: IUseSessionStorageOptions<TValue>
): TUseSessionStorage<TValue> {
    const [storedValue, setStoredValue] = useState<TValue | null>(() =>
        sessionStorageService.getValue<TValue>(key, defaultValue, options?.deserialize)
    );

    const setValue = (value: TValue) => {
        setStoredValue(value);
        sessionStorageService.setValue(key, value, options?.serialize);
    };

    const removeValue = () => {
        sessionStorageService.removeValue(key);
        setStoredValue(defaultValue);
    };

    return [storedValue, { setValue, removeValue }];
}
