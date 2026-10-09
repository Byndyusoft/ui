import { REQUEST_BUILDER_ERROR_CODES } from '../constants';
import { RequestBuilderError } from '../errors';
import { THttpHeaders } from '../types';
import { assertValidHeader } from './assertValidHeader';
import { isRecord } from './isRecord';

export function assertValidHeaders(headers: unknown): asserts headers is THttpHeaders {
    if (!isRecord(headers)) {
        throw new RequestBuilderError('Headers must be an object', REQUEST_BUILDER_ERROR_CODES.INVALID_HEADERS);
    }

    for (const [key, value] of Object.entries(headers)) {
        assertValidHeader(key, value);
    }
}
