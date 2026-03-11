export function defaultSerializer<TValue>(value: TValue): string {
    return JSON.stringify(value);
}
