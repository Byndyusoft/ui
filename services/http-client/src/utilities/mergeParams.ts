import { THttpParams } from '../types';

/** Merges query params from left to right and copies array values. */
export function mergeParams(...sources: Array<THttpParams | undefined>): THttpParams {
    const result: THttpParams = {};

    for (const source of sources) {
        if (source === undefined) {
            continue;
        }

        for (const [key, value] of Object.entries(source)) {
            result[key] = Array.isArray(value) ? [...value] : value;
        }
    }

    return result;
}
