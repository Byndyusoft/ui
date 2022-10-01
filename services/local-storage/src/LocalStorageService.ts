import { IStorageService } from '@byndyusoft-ui/core';

function defaultSerializer<TValue>(value: TValue): string {
    return JSON.stringify(value);
}

function defaultDeserializer<TValue>(raw: string): TValue {
    return JSON.parse(raw) as TValue;
}

export class LocalStorageService<TValue> implements IStorageService<TValue> {
    clear(): void {
        window.localStorage.clear();
    }

    getValue(key: string, defaultValue?: TValue, deserialize = defaultDeserializer<TValue>): TValue | null {
        const raw = window.localStorage.getItem(key);

        if (raw !== null) {
            try {
                return deserialize(raw);
            } catch {
                return defaultValue ?? null;
            }
        }

        return defaultValue ?? null;
    }

    hasValue(key: string): boolean {
        return window.localStorage.getItem(key) !== null;
    }

    removeValue(key: string): void {
        window.localStorage.removeItem(key);
    }

    setValue(key: string, value: TValue, serialize = defaultSerializer<TValue>): void {
        window.localStorage.setItem(key, serialize(value));
    }
}
