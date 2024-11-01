import { Callback } from './Callback';

export type StorageValueSerializer<T> = Callback<T, string>;

export type StorageValueDeserializer<T> = Callback<string, T>;

export interface IStorageService<TValue> {
    getValue(key: string, defaultValue?: TValue, deserialize?: StorageValueDeserializer<TValue>): TValue | null;
    setValue(key: string, value: TValue, serialize?: StorageValueSerializer<TValue>): void;
    removeValue(key: string): void;
    hasValue(key: string): boolean;
    clear(): void;
}
