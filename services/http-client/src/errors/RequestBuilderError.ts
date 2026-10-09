import { REQUEST_BUILDER_ERROR_CODES } from '../constants';
import { TRequestBuilderErrorCode } from '../types';
import { HttpClientError } from './HttpClientError';

export class RequestBuilderError extends HttpClientError {
    public readonly code: TRequestBuilderErrorCode;

    constructor(message: string, code: TRequestBuilderErrorCode = REQUEST_BUILDER_ERROR_CODES.INVALID_CONFIG) {
        super(message);

        this.code = code;
    }
}

export function isRequestBuilderError(error: unknown): error is RequestBuilderError {
    return error instanceof RequestBuilderError;
}
