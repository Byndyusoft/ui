import { HTTP_RESPONSE_TYPES, REQUEST_BUILDER_ERROR_CODES } from '../constants';
import { RequestBuilderError } from '../errors';
import { THttpResponseType } from '../types';

export function assertValidResponseType(responseType: unknown): asserts responseType is THttpResponseType {
    if (!Object.values(HTTP_RESPONSE_TYPES).includes(responseType as THttpResponseType)) {
        throw new RequestBuilderError(
            'Response type must be a valid HTTP response type',
            REQUEST_BUILDER_ERROR_CODES.INVALID_RESPONSE_TYPE
        );
    }
}
