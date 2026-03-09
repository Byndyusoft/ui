import { useCallback, useMemo, useRef, useState } from 'react';
import { TSerializeValue, TDeserializeValue, LocalStorageService } from '@byndyusoft-ui/local-storage';
import useEventListener from '@byndyusoft-ui/use-event-listener';

export interface IUseLocalStorageActions<TValue> {
    setValue: (value: TValue) => void;
    removeValue: () => void;
}

export interface IUseLocalStorageOptions<TValue> {
    serialize?: TSerializeValue<TValue>;
    deserialize?: TDeserializeValue<TValue>;
    syncTabs?: boolean;
}

export type TUseLocalStorage<TValue> = [TValue, IUseLocalStorageActions<TValue>];

export default function useLocalStorage<TValue>(
    key: string,
    defaultValue: TValue,
    options?: IUseLocalStorageOptions<TValue>
): TUseLocalStorage<TValue> {
    const service = useRef(
        new LocalStorageService(key, defaultValue, { serialize: options?.serialize, deserialize: options?.deserialize })
    );

    const [storedValue, setStoredValue] = useState<TValue>(() => service.current.getValue());

    const setValue = useCallback(
        (nextValue: TValue) => {
            service.current.setValue(nextValue);
            setStoredValue(nextValue);
        },
        [key, options]
    );

    const removeValue = useCallback(() => {
        service.current.removeValue();
        setStoredValue(defaultValue);
    }, [key, defaultValue]);

    const handleEvent = useCallback(
        (event: StorageEvent) => {
            if (event.key !== key) {
                return;
            }

            if (window.localStorage === event.storageArea || options?.syncTabs) {
                setStoredValue(event.newValue ? service.current.deserialize(event.newValue) : defaultValue);
            }
        },
        [key, options]
    );

    useEventListener('storage', handleEvent);

    const methods = useMemo<IUseLocalStorageActions<TValue>>(
        () => ({ setValue, removeValue }),
        [setValue, removeValue]
    );

    return [storedValue, methods];
}
