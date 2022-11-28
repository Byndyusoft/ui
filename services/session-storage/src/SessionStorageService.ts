import { IStorageService } from '@byndyusoft-ui/core';

function defaultSerializer<TValue>(value: TValue): string {
    return JSON.stringify(value);
}

function defaultDeserializer<TValue>(raw: string): TValue {
    return JSON.parse(raw) as TValue;
}

export class SessionStorageService<TValue> implements IStorageService<TValue> {
    clear(): void {
        window.sessionStorage.clear();
    }

    getValue(key: string, defaultValue?: TValue, deserialize = defaultDeserializer<TValue>): TValue | null {
        const raw = window.sessionStorage.getItem(key);

        if (raw !== null) {
            try {
                return deserialize(raw);
            } catch {
                throw new Error(`@byndyusoft-ui / Session Storage Service: Failed to deserialize the value`);
            }
        }

        return defaultValue ?? null;
    }

    hasValue(key: string): boolean {
        return window.sessionStorage.getItem(key) !== null;
    }

    removeValue(key: string): void {
        window.sessionStorage.removeItem(key);
    }

    setValue(key: string, value: TValue, serialize = defaultSerializer<TValue>): void {
        window.sessionStorage.setItem(key, serialize(value));
    }
}
