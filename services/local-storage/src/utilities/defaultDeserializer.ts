export function defaultDeserializer<TValue>(raw: string): TValue {
    return JSON.parse(raw) as TValue;
}
