import { describe, expectTypeOf, it } from 'vitest';
import { HTTP_METHODS, HTTP_STATUS_CODES } from '../../src/constants';
import { HttpRequestBuilder } from '../../src/core/HttpRequestBuilder';
import { IHttpRequestConfig, IHttpResponse, THttpParams, THttpRequestExecutor, TValidateStatus } from '../../src/types';

const executor: THttpRequestExecutor = <T>(config: IHttpRequestConfig): Promise<IHttpResponse<T>> =>
    Promise.resolve({
        status: HTTP_STATUS_CODES.OK,
        statusText: 'OK',
        headers: {},
        config
    });

describe('HttpRequestBuilder types', () => {
    it('selects the response data type before execution', () => {
        const getBuilder = new HttpRequestBuilder(executor, HTTP_METHODS.GET, '/items');
        const postBuilder = new HttpRequestBuilder(executor, HTTP_METHODS.POST, '/items');

        expectTypeOf(getBuilder).toEqualTypeOf<HttpRequestBuilder>();
        expectTypeOf(postBuilder).toEqualTypeOf<HttpRequestBuilder>();
        expectTypeOf(postBuilder.build()).toEqualTypeOf<Readonly<IHttpRequestConfig>>();
        expectTypeOf(postBuilder.execute()).toEqualTypeOf<Promise<IHttpResponse<unknown>>>();
        expectTypeOf(postBuilder.asJson<{ id: number }>().execute()).toEqualTypeOf<
            Promise<IHttpResponse<{ id: number }>>
        >();
        expectTypeOf(postBuilder.asText().execute()).toEqualTypeOf<Promise<IHttpResponse<string>>>();
        expectTypeOf(postBuilder.asBlob().execute()).toEqualTypeOf<Promise<IHttpResponse<Blob>>>();
        expectTypeOf(postBuilder.asArrayBuffer().execute()).toEqualTypeOf<Promise<IHttpResponse<ArrayBuffer>>>();
        expectTypeOf(postBuilder.asStream().execute()).toEqualTypeOf<
            Promise<IHttpResponse<ReadableStream<Uint8Array>>>
        >();

        if (false) {
            // @ts-expect-error The response type must be selected before execute.
            postBuilder.execute<{ id: number }>();
        }
    });

    it('preserves and replaces the selected response type across the immutable chain', () => {
        const builder = new HttpRequestBuilder(executor, HTTP_METHODS.POST, '/items')
            .asJson<{ id: number }>()
            .header('X-Test', 'value')
            .body({ name: 'Item' })
            .timeout(1000);

        expectTypeOf(builder.execute()).toEqualTypeOf<Promise<IHttpResponse<{ id: number }>>>();
        expectTypeOf(builder.validateStatus(status => status === 201).execute()).toEqualTypeOf<
            Promise<IHttpResponse<{ id: number }>>
        >();
        expectTypeOf(builder.asBlob().execute()).toEqualTypeOf<Promise<IHttpResponse<Blob>>>();
    });

    it('allows body calls for every method at compile time', () => {
        const getBuilder = new HttpRequestBuilder(executor, HTTP_METHODS.GET, '/items');
        const headBuilder = new HttpRequestBuilder(executor, HTTP_METHODS.HEAD, '/items');
        const postBuilder = new HttpRequestBuilder(executor, HTTP_METHODS.POST, '/items');

        expectTypeOf(getBuilder.body({ value: true })).toEqualTypeOf<HttpRequestBuilder>();
        expectTypeOf(headBuilder.body({ value: true })).toEqualTypeOf<HttpRequestBuilder>();
        expectTypeOf(postBuilder.body({ value: true })).toEqualTypeOf<HttpRequestBuilder>();
        expectTypeOf(postBuilder.withCredentials(true)).toEqualTypeOf<HttpRequestBuilder>();
        expectTypeOf(postBuilder.validateStatus(status => status === 200)).toEqualTypeOf<HttpRequestBuilder>();
    });

    it('exports the validateStatus predicate type', () => {
        const validateStatus: TValidateStatus = status => status >= 200 && status < 400;

        expectTypeOf(validateStatus).toEqualTypeOf<TValidateStatus>();
    });

    it('allows primitive query params', () => {
        const params: THttpParams = { page: 2, active: true, role: ['admin', false] };
        const builder = new HttpRequestBuilder(executor, HTTP_METHODS.GET, '/items');

        expectTypeOf(params).toEqualTypeOf<THttpParams>();
        expectTypeOf(builder.param('page', 2)).toEqualTypeOf<HttpRequestBuilder>();
        expectTypeOf(builder.param('active', true)).toEqualTypeOf<HttpRequestBuilder>();
    });
});
