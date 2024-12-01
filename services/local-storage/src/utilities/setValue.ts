import { defaultSerializer } from './defaultSerializer';

export function setValue<TValue>(key: string, value: TValue, serialize = defaultSerializer<TValue>): void {
    try {
        window.localStorage.setItem(key, serialize(value));
    } catch {
        throw new Error('Local Storage Service: Failed to set the serialized value');
    }
}
