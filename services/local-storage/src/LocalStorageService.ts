import { TDeserializer, TSerializer } from './LocalStorageService.types';
import { defaultDeserializer, defaultSerializer, hasValue, removeValue, setValue, getValue, clear } from './utilities';

export class LocalStorageService<TValue> {
    private readonly key: string;
    private readonly defaultValue: TValue;
    private readonly serializer?: TSerializer<TValue>;
    private readonly deserializer?: TDeserializer<TValue>;

    constructor(
        key: string,
        defaultValue: TValue,
        serializer: TSerializer<TValue> = defaultSerializer,
        deserialize: TDeserializer<TValue> = defaultDeserializer
    ) {
        this.key = key;
        this.defaultValue = defaultValue;
        this.serializer = serializer;
        this.deserializer = deserialize;
    }

    getValue(): TValue {
        return getValue(this.key, this.defaultValue, this.deserializer);
    }

    hasValue(): boolean {
        return hasValue(this.key);
    }

    removeValue(): void {
        removeValue(this.key);
    }

    setValue(value: TValue): void {
        setValue(this.key, value, this.serializer);
    }

    clear(): void {
        clear();
    }
}
