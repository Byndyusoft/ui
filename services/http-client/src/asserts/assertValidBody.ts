import { HTTP_METHODS, REQUEST_BUILDER_ERROR_CODES } from '../constants';
import { RequestBuilderError } from '../errors';
import { THttpMethod } from '../types';

/** Validates that a request method supports a body and that the body is explicitly defined. */
export function assertValidBody(method: THttpMethod, data: unknown): void {
    if (method === HTTP_METHODS.GET || method === HTTP_METHODS.HEAD) {
        throw new RequestBuilderError(
            'Body is not allowed for GET or HEAD requests',
            REQUEST_BUILDER_ERROR_CODES.INVALID_BODY
        );
    }

    if (data === undefined) {
        throw new RequestBuilderError('Body must not be undefined', REQUEST_BUILDER_ERROR_CODES.INVALID_BODY);
    }
}
