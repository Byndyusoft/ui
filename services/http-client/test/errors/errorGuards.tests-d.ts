import { describe, expectTypeOf, it } from 'vitest';
import {
    AbortError,
    HttpClientError,
    HttpResponseError,
    isAbortError,
    isHttpClientError,
    isHttpResponseError,
    isNetworkError,
    isParseError,
    isRequestBuilderError,
    isRequestPreparationError,
    isTimeoutError,
    NetworkError,
    ParseError,
    RequestBuilderError,
    RequestPreparationError,
    TimeoutError
} from '../../src/errors';
import { THttpResponseType } from '../../src/types';

interface IValidationError {
    message: string;
    errors: Record<string, string[]>;
}

function isValidationError(data: unknown): data is IValidationError {
    return typeof data === 'object' && data !== null;
}

describe('error guards', () => {
    it('narrow unknown errors to their concrete types', () => {
        const error: unknown = new Error('unknown');

        if (isHttpClientError(error)) {
            expectTypeOf(error).toEqualTypeOf<HttpClientError>();
        }

        if (isHttpResponseError(error)) {
            expectTypeOf(error).toEqualTypeOf<HttpResponseError>();
            expectTypeOf(error.data).toEqualTypeOf<unknown>();
        }

        if (isHttpResponseError(error) && isValidationError(error.data)) {
            expectTypeOf(error).toEqualTypeOf<HttpResponseError>();
            expectTypeOf(error.data).toEqualTypeOf<IValidationError>();
        }

        if (isNetworkError(error)) {
            expectTypeOf(error).toEqualTypeOf<NetworkError>();
        }

        if (isTimeoutError(error)) {
            expectTypeOf(error).toEqualTypeOf<TimeoutError>();
            expectTypeOf(error.timeout).toEqualTypeOf<number | undefined>();
        }

        if (isAbortError(error)) {
            expectTypeOf(error).toEqualTypeOf<AbortError>();
        }

        if (isParseError(error)) {
            expectTypeOf(error).toEqualTypeOf<ParseError>();
            expectTypeOf(error.responseType).toEqualTypeOf<THttpResponseType | undefined>();
            expectTypeOf(error.raw).toEqualTypeOf<string | undefined>();
        }

        if (isRequestBuilderError(error)) {
            expectTypeOf(error).toEqualTypeOf<RequestBuilderError>();
        }

        if (isRequestPreparationError(error)) {
            expectTypeOf(error).toEqualTypeOf<RequestPreparationError>();
        }
    });
});
