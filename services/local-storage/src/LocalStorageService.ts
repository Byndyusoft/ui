import { IOptions, TDeserializeValue, TSerializeValue } from './LocalStorageService.types';
import { defaultDeserializer, defaultSerializer, hasValue, removeValue, setValue, getValue } from './utilities';

export class LocalStorageService<TValue> {
    private readonly key: string;
    private readonly defaultValue: TValue;
    readonly serialize: TSerializeValue<TValue>;
    readonly deserialize: TDeserializeValue<TValue>;

    constructor(key: string, defaultValue: TValue, options?: IOptions<TValue>) {
        this.key = key;
        this.defaultValue = defaultValue;
        this.serialize = options?.serialize ?? defaultSerializer;
        this.deserialize = options?.deserialize ?? defaultDeserializer;
    }

    getValue(): TValue {
        return getValue(this.key, this.defaultValue, this.deserialize);
    }

    hasValue(): boolean {
        return hasValue(this.key);
    }

    removeValue(): void {
        removeValue(this.key);
    }

    setValue(value: TValue): void {
        setValue(this.key, value, this.serialize);
    }
}
