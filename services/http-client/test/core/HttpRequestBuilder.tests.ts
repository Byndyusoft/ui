import { HTTP_METHODS, HTTP_RESPONSE_TYPES, HTTP_STATUS_CODES, REQUEST_BUILDER_ERROR_CODES } from '../../src/constants';
import { HttpRequestBuilder } from '../../src/core/HttpRequestBuilder';
import { RequestBuilderError } from '../../src/errors';
import {
    IHttpRequestConfig,
    IHttpResponse,
    THttpHeaders,
    THttpMethod,
    THttpParams,
    THttpRequestExecutor,
    TRequestBuilderErrorCode
} from '../../src/types';

function createExecutor(configs: IHttpRequestConfig[] = []): THttpRequestExecutor {
    return <T>(config: IHttpRequestConfig): Promise<IHttpResponse<T>> => {
        configs.push(config);

        return Promise.resolve({
            status: HTTP_STATUS_CODES.OK,
            statusText: 'OK',
            headers: {},
            config
        });
    };
}

function expectRequestBuilderError(action: () => unknown, code: TRequestBuilderErrorCode): void {
    try {
        action();
        expect.fail('Should have thrown');
    } catch (error) {
        expect(error).toBeInstanceOf(RequestBuilderError);
        expect(error).toMatchObject({ code });
    }
}

describe('HttpRequestBuilder', () => {
    test('builds a request config through an immutable chain', () => {
        const executor = createExecutor();
        const controller = new AbortController();
        const validateStatus = (status: number): boolean => status < 500;
        const initialBuilder = new HttpRequestBuilder(executor, HTTP_METHODS.POST, '/items');
        const configuredBuilder = initialBuilder
            .baseUrl('https://example.test')
            .header('X-First', 'first')
            .headers({ 'X-Second': 'second' })
            .param('page', '2')
            .params({ role: ['admin', 'user'] })
            .body({ name: 'Item' })
            .signal(controller.signal)
            .timeout(0)
            .validateStatus(validateStatus)
            .withCredentials(true)
            .bearer('token')
            .asJson<unknown>();

        expect(initialBuilder.build()).toEqual({ method: HTTP_METHODS.POST, url: '/items' });
        expect(configuredBuilder).not.toBe(initialBuilder);
        expect(configuredBuilder.build()).toEqual({
            method: HTTP_METHODS.POST,
            url: '/items',
            baseUrl: 'https://example.test',
            headers: {
                'X-First': 'first',
                'X-Second': 'second',
                Authorization: 'Bearer token'
            },
            params: { page: '2', role: ['admin', 'user'] },
            data: { name: 'Item' },
            signal: controller.signal,
            timeout: 0,
            validateStatus,
            withCredentials: true,
            responseType: HTTP_RESPONSE_TYPES.JSON
        });
    });

    test('creates independent branches and build snapshots', () => {
        const sourceHeaders: THttpHeaders = { 'X-Source': 'source' };
        const sourceParams: THttpParams = { role: ['admin'] };
        const builder = new HttpRequestBuilder(createExecutor(), HTTP_METHODS.GET, '/items')
            .headers(sourceHeaders)
            .params(sourceParams);
        const firstBranch = builder.header('X-Branch', 'first').param('page', '1');
        const secondBranch = builder.header('X-Branch', 'second').param('page', '2');

        sourceHeaders['X-Source'] = 'changed';
        (sourceParams.role as string[]).push('user');

        const firstSnapshot = firstBranch.build();
        if (!firstSnapshot.headers || !firstSnapshot.params || !Array.isArray(firstSnapshot.params.role)) {
            throw new Error('Expected headers and array params in the snapshot');
        }
        firstSnapshot.headers['X-Source'] = 'mutated snapshot';
        firstSnapshot.params.role.push('editor');

        expect(builder.build()).toMatchObject({
            headers: { 'X-Source': 'source' },
            params: { role: ['admin'] }
        });
        expect(firstBranch.build()).toMatchObject({
            headers: { 'X-Source': 'source', 'X-Branch': 'first' },
            params: { role: ['admin'], page: '1' }
        });
        expect(secondBranch.build()).toMatchObject({
            headers: { 'X-Source': 'source', 'X-Branch': 'second' },
            params: { role: ['admin'], page: '2' }
        });
    });

    test('executes a built snapshot through the generic executor', async () => {
        const configs: IHttpRequestConfig[] = [];
        const builder = new HttpRequestBuilder(createExecutor(configs), HTTP_METHODS.GET, '/items').param('page', '1');

        const response = await builder.asJson<{ id: number }>().execute();

        expect(response.status).toBe(HTTP_STATUS_CODES.OK);
        expect(configs).toEqual([
            {
                method: HTTP_METHODS.GET,
                url: '/items',
                params: { page: '1' },
                responseType: HTTP_RESPONSE_TYPES.JSON
            }
        ]);
        expect(response.config).toBe(configs[0]);
    });

    test.each([
        {
            name: 'executor',
            action: () =>
                new HttpRequestBuilder(undefined as unknown as THttpRequestExecutor, HTTP_METHODS.GET, '/items'),
            code: REQUEST_BUILDER_ERROR_CODES.INVALID_EXECUTOR
        },
        {
            name: 'method',
            action: () => new HttpRequestBuilder(createExecutor(), 'INVALID' as THttpMethod, '/items'),
            code: REQUEST_BUILDER_ERROR_CODES.INVALID_METHOD
        },
        {
            name: 'CONNECT method',
            action: () => new HttpRequestBuilder(createExecutor(), 'CONNECT' as THttpMethod, '/items'),
            code: REQUEST_BUILDER_ERROR_CODES.INVALID_METHOD
        },
        {
            name: 'TRACE method',
            action: () => new HttpRequestBuilder(createExecutor(), 'TRACE' as THttpMethod, '/items'),
            code: REQUEST_BUILDER_ERROR_CODES.INVALID_METHOD
        },
        {
            name: 'URL',
            action: () => new HttpRequestBuilder(createExecutor(), HTTP_METHODS.GET, '   '),
            code: REQUEST_BUILDER_ERROR_CODES.INVALID_URL
        }
    ])('validates $name in the constructor', ({ action, code }) => {
        expectRequestBuilderError(action, code);
    });

    test.each([
        {
            name: 'base URL',
            action: (builder: HttpRequestBuilder) => builder.baseUrl('   '),
            code: REQUEST_BUILDER_ERROR_CODES.INVALID_BASE_URL
        },
        {
            name: 'header key',
            action: (builder: HttpRequestBuilder) => builder.header('Bad Header', 'value'),
            code: REQUEST_BUILDER_ERROR_CODES.INVALID_HEADER
        },
        {
            name: 'header value',
            action: (builder: HttpRequestBuilder) => builder.header('X-Test', 'value\nInjected'),
            code: REQUEST_BUILDER_ERROR_CODES.INVALID_HEADER
        },
        {
            name: 'headers object',
            action: (builder: HttpRequestBuilder) => builder.headers([] as unknown as THttpHeaders),
            code: REQUEST_BUILDER_ERROR_CODES.INVALID_HEADERS
        },
        {
            name: 'headers values',
            action: (builder: HttpRequestBuilder) => builder.headers({ 'X-Test': 1 } as unknown as THttpHeaders),
            code: REQUEST_BUILDER_ERROR_CODES.INVALID_HEADER
        },
        {
            name: 'param key',
            action: (builder: HttpRequestBuilder) => builder.param('   ', 'value'),
            code: REQUEST_BUILDER_ERROR_CODES.INVALID_PARAM
        },
        {
            name: 'param value',
            action: (builder: HttpRequestBuilder) => builder.param('page', Number.NaN),
            code: REQUEST_BUILDER_ERROR_CODES.INVALID_PARAM
        },
        {
            name: 'param object value',
            action: (builder: HttpRequestBuilder) => builder.param('page', {} as never),
            code: REQUEST_BUILDER_ERROR_CODES.INVALID_PARAM
        },
        {
            name: 'params object',
            action: (builder: HttpRequestBuilder) => builder.params([] as unknown as THttpParams),
            code: REQUEST_BUILDER_ERROR_CODES.INVALID_PARAMS
        },
        {
            name: 'signal',
            action: (builder: HttpRequestBuilder) => builder.signal({} as AbortSignal),
            code: REQUEST_BUILDER_ERROR_CODES.INVALID_SIGNAL
        },
        {
            name: 'timeout',
            action: (builder: HttpRequestBuilder) => builder.timeout(Number.POSITIVE_INFINITY),
            code: REQUEST_BUILDER_ERROR_CODES.INVALID_TIMEOUT
        },
        {
            name: 'with credentials',
            action: (builder: HttpRequestBuilder) => builder.withCredentials('true' as unknown as boolean),
            code: REQUEST_BUILDER_ERROR_CODES.INVALID_WITH_CREDENTIALS
        },
        {
            name: 'validate status',
            action: (builder: HttpRequestBuilder) =>
                builder.validateStatus(true as unknown as (status: number) => boolean),
            code: REQUEST_BUILDER_ERROR_CODES.INVALID_VALIDATE_STATUS
        },
        {
            name: 'bearer token',
            action: (builder: HttpRequestBuilder) => builder.bearer('   '),
            code: REQUEST_BUILDER_ERROR_CODES.INVALID_BEARER_TOKEN
        }
    ])('validates $name', ({ action, code }) => {
        const builder = new HttpRequestBuilder(createExecutor(), HTTP_METHODS.POST, '/items');

        expectRequestBuilderError(() => action(builder), code);
    });

    test.each([HTTP_METHODS.GET, HTTP_METHODS.HEAD])('rejects a body for %s at runtime', method => {
        const builder: HttpRequestBuilder = new HttpRequestBuilder(createExecutor(), method, '/items');

        expectRequestBuilderError(() => builder.body({ value: true }), REQUEST_BUILDER_ERROR_CODES.INVALID_BODY);
    });

    test('allows a body for DELETE', () => {
        const builder = new HttpRequestBuilder(createExecutor(), HTTP_METHODS.DELETE, '/items/1');

        expect(builder.body({ hard: true }).build().data).toEqual({ hard: true });
    });

    test('rejects an explicitly undefined body', () => {
        const builder = new HttpRequestBuilder(createExecutor(), HTTP_METHODS.POST, '/items');

        expectRequestBuilderError(() => builder.body(undefined), REQUEST_BUILDER_ERROR_CODES.INVALID_BODY);
    });

    test('allows null as an explicit JSON body', () => {
        const builder = new HttpRequestBuilder(createExecutor(), HTTP_METHODS.POST, '/items');

        expect(builder.body(null).build().data).toBeNull();
    });

    test('accepts nullish params and drops them on merge override', () => {
        const builder = new HttpRequestBuilder(createExecutor(), HTTP_METHODS.GET, '/items')
            .params({ page: 1, locale: 'ru', role: ['admin', null, 'user'] })
            .param('locale', null)
            .params({ role: undefined });

        expect(builder.build().params).toEqual({ page: 1 });
    });

    test('sets params to undefined when no values remain after merge', () => {
        const builder = new HttpRequestBuilder(createExecutor(), HTTP_METHODS.GET, '/items')
            .params({ page: 1, role: [null, undefined] })
            .param('page', null);
        const config = builder.build();

        expect(config.params).toBeUndefined();
    });

    test('keeps the default error code for backwards-compatible construction', () => {
        expect(new RequestBuilderError('Invalid config').code).toBe(REQUEST_BUILDER_ERROR_CODES.INVALID_CONFIG);
    });
});
