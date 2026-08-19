import { THttpHeaders } from '../types';

export function mergeHeaders(...sources: Array<THttpHeaders | undefined>): THttpHeaders {
    const result: THttpHeaders = {};
    const normalizedKeys = new Map<string, string>();

    for (const source of sources) {
        if (source === undefined) {
            continue;
        }

        for (const [key, value] of Object.entries(source)) {
            const normalizedKey = key.toLowerCase();
            const previousKey = normalizedKeys.get(normalizedKey);

            if (previousKey !== undefined) {
                delete result[previousKey];
            }

            result[key] = value;
            normalizedKeys.set(normalizedKey, key);
        }
    }

    return result;
}

export function hasHeader(headers: THttpHeaders, name: string): boolean {
    const normalizedName = name.toLowerCase();

    return Object.keys(headers).some(key => key.toLowerCase() === normalizedName);
}
