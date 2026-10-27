import { HTTP_METHODS, HTTP_STATUS_CODES, REQUEST_BUILDER_ERROR_CODES } from '../../src/constants';
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
import { IHttpRequestConfig } from '../../src/types';

const config: IHttpRequestConfig = { method: HTTP_METHODS.GET, url: '/items' };

const errors: Array<{ name: string; create: () => HttpClientError }> = [
    { name: 'AbortError', create: () => new AbortError('aborted') },
    {
        name: 'HttpResponseError',
        create: () =>
            new HttpResponseError('failed', HTTP_STATUS_CODES.BAD_REQUEST, 'Bad Request', {}, config, { error: 'bad' })
    },
    { name: 'NetworkError', create: () => new NetworkError('network down') },
    { name: 'ParseError', create: () => new ParseError('invalid json') },
    {
        name: 'RequestBuilderError',
        create: () => new RequestBuilderError('invalid', REQUEST_BUILDER_ERROR_CODES.INVALID_URL)
    },
    { name: 'RequestPreparationError', create: () => new RequestPreparationError('failed', { config }) },
    { name: 'TimeoutError', create: () => new TimeoutError('timed out') }
];

const errorGuards: Array<{ name: string; guard: (error: unknown) => boolean; create: () => HttpClientError }> = [
    { name: 'AbortError', guard: isAbortError, create: () => new AbortError('aborted') },
    {
        name: 'HttpResponseError',
        guard: isHttpResponseError,
        create: () =>
            new HttpResponseError('failed', HTTP_STATUS_CODES.BAD_REQUEST, 'Bad Request', {}, config, { error: 'bad' })
    },
    { name: 'NetworkError', guard: isNetworkError, create: () => new NetworkError('network down') },
    { name: 'ParseError', guard: isParseError, create: () => new ParseError('invalid json') },
    {
        name: 'RequestBuilderError',
        guard: isRequestBuilderError,
        create: () => new RequestBuilderError('invalid', REQUEST_BUILDER_ERROR_CODES.INVALID_URL)
    },
    {
        name: 'RequestPreparationError',
        guard: isRequestPreparationError,
        create: () => new RequestPreparationError('failed', { config })
    },
    { name: 'TimeoutError', guard: isTimeoutError, create: () => new TimeoutError('timed out') }
];

describe('HttpClientError', () => {
    it.each(errors)('$name is catchable via instanceof HttpClientError and Error', ({ name, create }) => {
        const error = create();

        expect(error).toBeInstanceOf(HttpClientError);
        expect(error).toBeInstanceOf(Error);
        expect(error.name).toBe(name);
    });

    it.each(errors)('$name keeps its own prototype for specific instanceof checks', ({ create }) => {
        const error = create();

        expect(error).toBeInstanceOf(error.constructor as new (...args: never[]) => unknown);
    });

    it.each(errorGuards)('$name guard identifies its error type', ({ guard, create }) => {
        const error = create();

        expect(isHttpClientError(error)).toBe(true);
        expect(guard(error)).toBe(true);
    });

    it.each(errorGuards)('$name guard rejects unrelated errors', ({ guard }) => {
        expect(guard(new Error('unrelated'))).toBe(false);
    });

    it('preserves HttpResponseError fields and base config', () => {
        const headers = { 'x-a': 'b' };
        const error = new HttpResponseError('failed', HTTP_STATUS_CODES.NOT_FOUND, 'Not Found', headers, config, {
            error: 'Not found'
        });

        expect(error.message).toBe('failed');
        expect(error.status).toBe(HTTP_STATUS_CODES.NOT_FOUND);
        expect(error.statusText).toBe('Not Found');
        expect(error.headers).toBe(headers);
        expect(error.config).toBe(config);
        expect(error.data).toEqual({ error: 'Not found' });
        expect((error as HttpClientError).config).toBe(config);
    });

    it('preserves RequestBuilderError code including the default', () => {
        expect(new RequestBuilderError('invalid', REQUEST_BUILDER_ERROR_CODES.INVALID_URL).code).toBe(
            REQUEST_BUILDER_ERROR_CODES.INVALID_URL
        );
        expect(new RequestBuilderError('invalid').code).toBe(REQUEST_BUILDER_ERROR_CODES.INVALID_CONFIG);
    });

    it('preserves ParseError fields', () => {
        const cause = new SyntaxError('Unexpected token');
        const error = new ParseError('Failed to parse response body as JSON', {
            cause,
            config,
            responseType: 'json',
            raw: '{ invalid'
        });

        expect(error.cause).toBe(cause);
        expect(error.config).toBe(config);
        expect(error.responseType).toBe('json');
        expect(error.raw).toBe('{ invalid');
    });

    it('preserves TimeoutError timeout', () => {
        const error = new TimeoutError('Request timed out after 50ms', { config, timeout: 50 });

        expect(error.timeout).toBe(50);
        expect(error.config).toBe(config);
    });

    it('preserves the cause and config of a RequestPreparationError', () => {
        const cause = new TypeError('Cannot serialize request body');
        const error = new RequestPreparationError('Failed to prepare HTTP request', { cause, config });

        expect(error.cause).toBe(cause);
        expect(error.config).toBe(config);
    });
});
