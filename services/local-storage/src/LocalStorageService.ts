import { defaultDeserializer, defaultSerializer, hasValue, removeValue, setValue, getValue } from './utilities';

export class LocalStorageService<TValue> {
    key: string;
    serializer: (value: TValue) => string;
    deserializer: (raw: string) => TValue;

    constructor(key: string, serializer = defaultSerializer, deserialize = defaultDeserializer) {
        this.key = key;
        this.serializer = serializer;
        this.deserializer = deserialize;
    }

    getValue(defaultValue?: TValue): TValue | null {
        return getValue(this.key, defaultValue, this.deserializer);
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
}
