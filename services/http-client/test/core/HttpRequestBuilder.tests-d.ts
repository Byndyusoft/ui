import { describe, expectTypeOf, it } from 'vitest';
import { HTTP_METHODS, HTTP_STATUS_CODES } from '../../src/constants';
import { HttpRequestBuilder } from '../../src/core/HttpRequestBuilder';
import { IHttpRequestConfig, IHttpResponse, THttpRequestExecutor } from '../../src/types';

const executor: THttpRequestExecutor = <T>(config: IHttpRequestConfig): Promise<IHttpResponse<T>> =>
    Promise.resolve({
        status: HTTP_STATUS_CODES.OK,
        statusText: 'OK',
        headers: {},
        config
    });

describe('HttpRequestBuilder types', () => {
    it('preserves the response type', () => {
        const getBuilder = new HttpRequestBuilder(executor, HTTP_METHODS.GET, '/items');
        const postBuilder = new HttpRequestBuilder(executor, HTTP_METHODS.POST, '/items');

        expectTypeOf(getBuilder).toEqualTypeOf<HttpRequestBuilder>();
        expectTypeOf(postBuilder).toEqualTypeOf<HttpRequestBuilder>();
        expectTypeOf(postBuilder.build()).toEqualTypeOf<Readonly<IHttpRequestConfig>>();
        expectTypeOf(postBuilder.execute<{ id: number }>()).toEqualTypeOf<Promise<IHttpResponse<{ id: number }>>>();
    });

    it('allows body calls for every method at compile time', () => {
        const getBuilder = new HttpRequestBuilder(executor, HTTP_METHODS.GET, '/items');
        const headBuilder = new HttpRequestBuilder(executor, HTTP_METHODS.HEAD, '/items');
        const postBuilder = new HttpRequestBuilder(executor, HTTP_METHODS.POST, '/items');

        expectTypeOf(getBuilder.body({ value: true })).toEqualTypeOf<HttpRequestBuilder>();
        expectTypeOf(headBuilder.body({ value: true })).toEqualTypeOf<HttpRequestBuilder>();
        expectTypeOf(postBuilder.body({ value: true })).toEqualTypeOf<HttpRequestBuilder>();
    });
});
