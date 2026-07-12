import { HTTP_METHODS, REQUEST_BUILDER_ERROR_CODES } from '../constants';
import { RequestBuilderError } from '../errors';
import { THttpMethod } from '../types';

export function assertBodyAllowed(method: THttpMethod): void {
    if (method === HTTP_METHODS.GET || method === HTTP_METHODS.HEAD) {
        throw new RequestBuilderError(
            'Body is not allowed for GET or HEAD requests',
            REQUEST_BUILDER_ERROR_CODES.INVALID_BODY
        );
    }
}
