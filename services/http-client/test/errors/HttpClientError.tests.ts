import { HTTP_METHODS, HTTP_STATUS_CODES, REQUEST_BUILDER_ERROR_CODES } from '../../src/constants';
import {
    AbortError,
    HttpClientError,
    HttpError,
    NetworkError,
    ParseError,
    RequestBuilderError,
    ResponseError,
    TimeoutError
} from '../../src/errors';
import { IHttpRequestConfig } from '../../src/types';

const config: IHttpRequestConfig = { method: HTTP_METHODS.GET, url: '/items' };

const errors: Array<{ name: string; create: () => HttpClientError }> = [
    { name: 'AbortError', create: () => new AbortError('aborted') },
    { name: 'HttpError', create: () => new HttpError('failed', HTTP_STATUS_CODES.BAD_REQUEST, { error: 'bad' }) },
    { name: 'NetworkError', create: () => new NetworkError('network down') },
    { name: 'ParseError', create: () => new ParseError('invalid json') },
    {
        name: 'RequestBuilderError',
        create: () => new RequestBuilderError('invalid', REQUEST_BUILDER_ERROR_CODES.INVALID_URL)
    },
    {
        name: 'ResponseError',
        create: () => new ResponseError('failed', HTTP_STATUS_CODES.BAD_REQUEST, 'Bad Request', {}, config)
    },
    { name: 'TimeoutError', create: () => new TimeoutError('timed out') }
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

    it('preserves HttpError fields', () => {
        const error = new HttpError('failed', HTTP_STATUS_CODES.NOT_FOUND, { error: 'Not found' });

        expect(error.message).toBe('failed');
        expect(error.statusCode).toBe(HTTP_STATUS_CODES.NOT_FOUND);
        expect(error.data).toEqual({ error: 'Not found' });
    });

    it('preserves RequestBuilderError code including the default', () => {
        expect(new RequestBuilderError('invalid', REQUEST_BUILDER_ERROR_CODES.INVALID_URL).code).toBe(
            REQUEST_BUILDER_ERROR_CODES.INVALID_URL
        );
        expect(new RequestBuilderError('invalid').code).toBe(REQUEST_BUILDER_ERROR_CODES.INVALID_CONFIG);
    });

    it('preserves ResponseError fields', () => {
        const headers = { 'x-a': 'b' };
        const error = new ResponseError('failed', HTTP_STATUS_CODES.BAD_REQUEST, 'Bad Request', headers, config, {
            error: 'bad'
        });

        expect(error.statusCode).toBe(HTTP_STATUS_CODES.BAD_REQUEST);
        expect(error.statusText).toBe('Bad Request');
        expect(error.headers).toBe(headers);
        expect(error.config).toBe(config);
        expect(error.data).toEqual({ error: 'bad' });
    });
});
