import { REQUEST_BUILDER_ERROR_CODES } from '../constants';
import { RequestBuilderError } from '../errors';
import { THttpParams } from '../types';
import { assertValidParam } from './assertValidParam';
import { isRecord } from './isRecord';

export function assertValidParams(params: unknown): asserts params is THttpParams {
    if (!isRecord(params)) {
        throw new RequestBuilderError('Params must be an object', REQUEST_BUILDER_ERROR_CODES.INVALID_PARAMS);
    }

    for (const [key, value] of Object.entries(params)) {
        assertValidParam(key, value);
    }
}
