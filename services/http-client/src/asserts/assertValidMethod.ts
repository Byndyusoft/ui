import { HTTP_METHODS, REQUEST_BUILDER_ERROR_CODES } from '../constants';
import { RequestBuilderError } from '../errors';
import { THttpMethod } from '../types';

export function assertValidMethod(method: unknown): asserts method is THttpMethod {
    if (!Object.values(HTTP_METHODS).includes(method as THttpMethod)) {
        throw new RequestBuilderError('Method must be a valid HTTP method', REQUEST_BUILDER_ERROR_CODES.INVALID_METHOD);
    }
}
