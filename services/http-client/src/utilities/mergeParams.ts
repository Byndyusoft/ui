import { THttpParamPrimitive, THttpParams } from '../types';

function isPresentParamPrimitive(value: unknown): value is THttpParamPrimitive {
    return value !== null && value !== undefined;
}

/** Merges query params from left to right. `null` / `undefined` remove a key; nullish array items are dropped. */
export function mergeParams(...sources: Array<THttpParams | undefined>): THttpParams {
    const result: THttpParams = {};

    for (const source of sources) {
        if (source === undefined) {
            continue;
        }

        for (const [key, value] of Object.entries(source)) {
            if (value === null || value === undefined) {
                delete result[key];
                continue;
            }

            if (Array.isArray(value)) {
                const items = value.filter(isPresentParamPrimitive);

                if (items.length === 0) {
                    delete result[key];
                } else {
                    result[key] = [...items];
                }

                continue;
            }

            result[key] = value;
        }
    }

    return result;
}
