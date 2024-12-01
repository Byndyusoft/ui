import { defaultDeserializer } from './defaultDeserializer';

export function getValue<TValue>(
    key: string,
    defaultValue: TValue | null = null,
    deserialize = defaultDeserializer<TValue>
): TValue | null {
    const raw = window.localStorage.getItem(key);

    if (raw !== null) {
        try {
            return deserialize(raw);
        } catch {
            throw new Error('Local Storage Service: Failed to deserialize the value');
        }
    }

    return defaultValue;
}
