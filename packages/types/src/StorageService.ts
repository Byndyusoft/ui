export type TStorageValueSerializer<T> = (value: T) => string;

export type TStorageValueDeserializer<T> = (raw: string) => T;

export interface IStorageService<TValue> {
    getValue(key: string, defaultValue?: TValue, deserialize?: TStorageValueDeserializer<TValue>): TValue | null;
    setValue(key: string, value: TValue, serialize?: TStorageValueSerializer<TValue>): void;
    removeValue(key: string): void;
    hasValue(key: string): boolean;
    clear(): void;
}
