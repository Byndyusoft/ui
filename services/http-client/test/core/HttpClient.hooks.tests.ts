import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { HttpClient } from '../../src/core/HttpClient';
import { FetchAdapter } from '../../src/adapters/FetchAdapter';
import { XhrAdapter } from '../../src/adapters/XhrAdapter';
import { HTTP_METHODS, HTTP_STATUS_CODES, REQUEST_BUILDER_ERROR_CODES } from '../../src/constants';
import {
    AbortError,
    HttpResponseError,
    NetworkError,
    RequestBuilderError,
    RequestPreparationError
} from '../../src/errors';
import { IHttpClientAdapter, IHttpClientOptions, IHttpRequestConfig, IHttpResponse } from '../../src/types';
import { handlers } from '../__handlers__/HttpClient.hooks.handlers';
import { BASE_URL } from '../__fixtures__';

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
beforeEach(() => server.use(...handlers));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const adapters: Array<{ name: string; create: () => IHttpClientAdapter }> = [
    { name: 'FetchAdapter', create: () => new FetchAdapter() },
    { name: 'XhrAdapter', create: () => new XhrAdapter() }
];

describe.each(adapters)('HttpClient.$name — hooks', ({ create }) => {
    function createClient(hooks: Partial<IHttpClientOptions> = {}): HttpClient {
        return new HttpClient({ adapter: create(), baseUrl: BASE_URL, ...hooks });
    }

    test('onRequest receives the merged config and its result reaches the adapter', async () => {
        let receivedConfig: IHttpRequestConfig | undefined;
        const client = new HttpClient({
            adapter: create(),
            baseUrl: BASE_URL,
            headers: { 'X-Default': 'default-header' },
            timeout: 5000,
            onRequest: config => {
                receivedConfig = config;

                return { ...config, headers: { ...config.headers, Authorization: 'Bearer token' } };
            }
        });

        const response = await client
            .get('/echo-headers')
            .header('X-Custom', 'value')
            .asJson<{ authorization: string | null }>()
            .execute();

        expect(receivedConfig?.baseUrl).toBe(BASE_URL);
        expect(receivedConfig?.timeout).toBe(5000);
        expect(receivedConfig?.headers).toMatchObject({ 'X-Default': 'default-header', 'X-Custom': 'value' });
        expect(response.data?.authorization).toBe('Bearer token');
    });

    test('supports an async onRequest hook', async () => {
        const client = createClient({
            onRequest: config =>
                Promise.resolve({
                    ...config,
                    headers: { ...config.headers, Authorization: 'Bearer async-token' }
                })
        });

        const response = await client.get('/echo-headers').asJson<{ authorization: string | null }>().execute();

        expect(response.data?.authorization).toBe('Bearer async-token');
    });

    test('passes an invalid config returned by onRequest to onRequestError', async () => {
        let caught: unknown;
        const client = createClient({
            onRequest: config => ({ ...config, method: 'INVALID' } as unknown as IHttpRequestConfig),
            onRequestError: error => {
                caught = error;

                return { method: HTTP_METHODS.GET, url: '/items', baseUrl: BASE_URL };
            }
        });

        const response = await client.get('/items').asJson<{ id: number }>().execute();

        expect(response.data?.id).toBe(1);
        expect(caught).toMatchObject({
            code: REQUEST_BUILDER_ERROR_CODES.INVALID_METHOD
        });
    });

    test('rejects data: undefined returned by onRequest', async () => {
        let caught: unknown;
        const client = createClient({
            onRequest: config => ({ ...config, data: undefined }),
            onRequestError: error => {
                caught = error;
            }
        });

        await expect(client.post('/items').body({ valid: true }).execute()).rejects.toMatchObject({
            code: REQUEST_BUILDER_ERROR_CODES.INVALID_BODY
        });
        expect(caught).toMatchObject({ code: REQUEST_BUILDER_ERROR_CODES.INVALID_BODY });
    });

    test('rejects an invalid validateStatus returned by onRequest', async () => {
        const client = createClient({
            onRequest: config => ({ ...config, validateStatus: true } as unknown as IHttpRequestConfig)
        });

        await expect(client.get('/items').execute()).rejects.toMatchObject({
            code: REQUEST_BUILDER_ERROR_CODES.INVALID_VALIDATE_STATUS
        });
    });

    test('rejects an invalid config returned by onRequestError without sending the request', async () => {
        let hits = 0;
        server.use(
            http.get(`${BASE_URL}/items`, () => {
                hits += 1;

                return HttpResponse.json({});
            })
        );
        const onResponseError = vi.fn();
        const client = createClient({
            onRequest: () => {
                throw new Error('token storage failed');
            },
            onRequestError: () => ({ method: 'INVALID', url: '/items' } as unknown as IHttpRequestConfig),
            onResponseError
        });

        await expect(client.get('/items').execute()).rejects.toMatchObject({
            code: REQUEST_BUILDER_ERROR_CODES.INVALID_METHOD
        });
        expect(hits).toBe(0);
        expect(onResponseError).not.toHaveBeenCalled();
    });

    test('does not call the adapter and propagates the error when onRequest throws', async () => {
        let hits = 0;
        server.use(
            http.get(`${BASE_URL}/items`, () => {
                hits += 1;

                return HttpResponse.json({});
            })
        );

        const hookError = new Error('token storage failed');
        const onResponseError = vi.fn();
        const client = createClient({
            onRequest: () => {
                throw hookError;
            },
            onResponseError
        });

        await expect(client.get('/items').execute()).rejects.toBe(hookError);
        expect(hits).toBe(0);
        expect(onResponseError).not.toHaveBeenCalled();
    });

    test('resumes the request when onRequestError returns a config', async () => {
        const client = createClient({
            onRequest: () => {
                throw new Error('no token');
            },
            onRequestError: error => {
                expect(error).toBeInstanceOf(Error);

                return { method: HTTP_METHODS.GET, url: '/items', baseUrl: BASE_URL };
            }
        });

        const response = await client.get('/items').asJson<{ id: number }>().execute();

        expect(response.data?.id).toBe(1);
    });

    test('propagates the original error when onRequestError returns nothing', async () => {
        const hookError = new Error('no token');
        const client = createClient({
            onRequest: () => {
                throw hookError;
            },
            onRequestError: () => undefined
        });

        await expect(client.get('/items').execute()).rejects.toBe(hookError);
    });

    test('onResponse can transform the response and onResponseError is not called on success', async () => {
        const onResponse = vi.fn((response: IHttpResponse<unknown>) => ({
            ...response,
            data: { wrapped: response.data }
        }));
        const onResponseError = vi.fn();
        const client = createClient({ onResponse, onResponseError });

        const response = await client.get('/items').asJson<{ wrapped: { id: number; name: string } }>().execute();

        expect(onResponse).toHaveBeenCalledTimes(1);
        expect(response.data?.wrapped).toEqual({ id: 1, name: 'John' });
        expect(onResponseError).not.toHaveBeenCalled();
    });

    test('routes an onResponse failure to onResponseError', async () => {
        const transformError = new Error('bad envelope');
        const onResponseError = vi.fn(() => undefined);
        const client = createClient({
            onResponse: () => {
                throw transformError;
            },
            onResponseError
        });

        await expect(client.get('/items').execute()).rejects.toBe(transformError);
        expect(onResponseError).toHaveBeenCalledTimes(1);
        expect(onResponseError).toHaveBeenCalledWith(transformError);
    });

    test('onResponseError receives HttpResponseError with parsed data on 404, onResponse is not called', async () => {
        const onResponse = vi.fn((response: IHttpResponse<unknown>) => response);
        let caught: unknown;
        const client = createClient({
            onResponse,
            onResponseError: error => {
                caught = error;

                return undefined;
            }
        });

        await expect(client.get('/not-found').execute()).rejects.toBeInstanceOf(HttpResponseError);
        expect(onResponse).not.toHaveBeenCalled();
        expect(caught).toBeInstanceOf(HttpResponseError);
        expect((caught as HttpResponseError).status).toBe(HTTP_STATUS_CODES.NOT_FOUND);
        expect((caught as HttpResponseError).data).toEqual({ error: 'Not found' });
    });

    test('onResponseError receives NetworkError on a network failure', async () => {
        let caught: unknown;
        const client = createClient({
            onResponseError: error => {
                caught = error;

                return undefined;
            }
        });

        await expect(client.get('/network-error').execute()).rejects.toBeInstanceOf(NetworkError);
        expect(caught).toBeInstanceOf(NetworkError);
    });

    test('onResponseError receives RequestPreparationError when request serialization fails', async () => {
        const body: { self?: unknown } = {};
        body.self = body;
        let caught: unknown;
        const client = createClient({
            onResponseError: error => {
                caught = error;

                return undefined;
            }
        });

        await expect(client.post('/items').body(body).execute()).rejects.toBeInstanceOf(RequestPreparationError);
        expect(caught).toBeInstanceOf(RequestPreparationError);
        expect(caught).toMatchObject({ config: { method: HTTP_METHODS.POST, url: '/items', baseUrl: BASE_URL } });
        expect((caught as RequestPreparationError).cause).toBeInstanceOf(TypeError);
    });

    test('onResponseError receives AbortError for an already aborted signal', async () => {
        let caught: unknown;
        const client = createClient({
            onResponseError: error => {
                caught = error;

                return undefined;
            }
        });

        const controller = new AbortController();
        controller.abort();

        await expect(client.get('/items').signal(controller.signal).execute()).rejects.toBeInstanceOf(AbortError);
        expect(caught).toBeInstanceOf(AbortError);
    });

    test('returns a recovered response from onResponseError without re-running onResponse', async () => {
        const onResponse = vi.fn((response: IHttpResponse<unknown>) => response);
        const client = createClient({
            onResponse,
            onResponseError: () => ({
                data: { recovered: true },
                status: HTTP_STATUS_CODES.OK,
                statusText: 'OK',
                headers: {},
                config: { method: HTTP_METHODS.GET, url: '/not-found' }
            })
        });

        const response = await client.get('/not-found').asJson<{ recovered: boolean }>().execute();

        expect(response.data).toEqual({ recovered: true });
        expect(onResponse).not.toHaveBeenCalled();
    });

    test('propagates the error thrown by onResponseError', async () => {
        const domainError = new Error('domain error');
        const client = createClient({
            onResponseError: () => {
                throw domainError;
            }
        });

        await expect(client.get('/not-found').execute()).rejects.toBe(domainError);
    });

    test('does not invoke any hook when request building fails', () => {
        const onRequest = vi.fn((config: IHttpRequestConfig) => config);
        const onRequestError = vi.fn();
        const onResponse = vi.fn((response: IHttpResponse<unknown>) => response);
        const onResponseError = vi.fn();
        const client = createClient({ onRequest, onRequestError, onResponse, onResponseError });

        expect(() => client.get('/items').body({ value: true })).toThrowError(RequestBuilderError);
        expect(onRequest).not.toHaveBeenCalled();
        expect(onRequestError).not.toHaveBeenCalled();
        expect(onResponse).not.toHaveBeenCalled();
        expect(onResponseError).not.toHaveBeenCalled();
    });

    test('applies hooks set on the instance', async () => {
        const client = createClient().onRequest(config => ({
            ...config,
            headers: { ...config.headers, Authorization: 'Bearer instance-token' }
        }));

        const response = await client.get('/echo-headers').asJson<{ authorization: string | null }>().execute();

        expect(response.data?.authorization).toBe('Bearer instance-token');
    });

    test('instance hooks override constructor options hooks', async () => {
        const client = createClient({
            onRequest: config => ({
                ...config,
                headers: { ...config.headers, Authorization: 'Bearer constructor-token' }
            })
        });

        client.onRequest(config => ({
            ...config,
            headers: { ...config.headers, Authorization: 'Bearer override-token' }
        }));

        const response = await client.get('/echo-headers').asJson<{ authorization: string | null }>().execute();

        expect(response.data?.authorization).toBe('Bearer override-token');
    });

    test('supports chaining when setting hooks on the instance', async () => {
        const client = createClient();

        const chained = client
            .onRequest(config => config)
            .onRequestError(() => undefined)
            .onResponse(response => ({ ...response, data: { chained: true } }))
            .onResponseError(() => undefined);

        expect(chained).toBe(client);

        const response = await client.get('/items').asJson<{ chained: boolean }>().execute();

        expect(response.data).toEqual({ chained: true });
    });

    test('applies instance hooks to subsequent requests only', async () => {
        const client = createClient();

        const before = await client.get('/echo-headers').asJson<{ authorization: string | null }>().execute();

        expect(before.data?.authorization).toBeNull();

        client.onRequest(config => ({
            ...config,
            headers: { ...config.headers, Authorization: 'Bearer late-token' }
        }));

        const after = await client.get('/echo-headers').asJson<{ authorization: string | null }>().execute();

        expect(after.data?.authorization).toBe('Bearer late-token');
    });

    test('applies an instance onResponseError hook', async () => {
        const client = createClient();
        let caught: unknown;

        client.onResponseError(error => {
            caught = error;

            return undefined;
        });

        await expect(client.get('/not-found').execute()).rejects.toBeInstanceOf(HttpResponseError);
        expect(caught).toBeInstanceOf(HttpResponseError);
        expect((caught as HttpResponseError).status).toBe(HTTP_STATUS_CODES.NOT_FOUND);
    });
});

describe('XhrAdapter preparation errors', () => {
    test('wraps a synchronous xhr.open failure', async () => {
        const cause = new DOMException('Invalid URL', 'SyntaxError');
        const xhr = {
            open: vi.fn(() => {
                throw cause;
            })
        } as unknown as XMLHttpRequest;
        vi.stubGlobal(
            'XMLHttpRequest',
            vi.fn(() => xhr)
        );

        const client = new HttpClient({ adapter: new XhrAdapter(), baseUrl: BASE_URL });

        try {
            await client.get('/items').execute();
            expect.fail('Should have thrown');
        } catch (error) {
            expect(error).toBeInstanceOf(RequestPreparationError);
            expect((error as RequestPreparationError).cause).toBe(cause);
            expect((error as RequestPreparationError).config).toMatchObject({ url: '/items', baseUrl: BASE_URL });
        } finally {
            vi.unstubAllGlobals();
        }
    });
});
