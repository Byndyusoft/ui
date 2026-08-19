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

describe('error guards', () => {
    it('narrow unknown errors to their concrete types', () => {
        const error: unknown = new Error('unknown');

        if (isHttpClientError(error)) {
            expectTypeOf(error).toEqualTypeOf<HttpClientError>();
        }

        if (isHttpResponseError(error)) {
            expectTypeOf(error).toEqualTypeOf<HttpResponseError>();
        }

        if (isNetworkError(error)) {
            expectTypeOf(error).toEqualTypeOf<NetworkError>();
        }

        if (isTimeoutError(error)) {
            expectTypeOf(error).toEqualTypeOf<TimeoutError>();
        }

        if (isAbortError(error)) {
            expectTypeOf(error).toEqualTypeOf<AbortError>();
        }

        if (isParseError(error)) {
            expectTypeOf(error).toEqualTypeOf<ParseError>();
        }

        if (isRequestBuilderError(error)) {
            expectTypeOf(error).toEqualTypeOf<RequestBuilderError>();
        }

        if (isRequestPreparationError(error)) {
            expectTypeOf(error).toEqualTypeOf<RequestPreparationError>();
        }
    });
});
