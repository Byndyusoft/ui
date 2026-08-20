import { HttpClient } from '../../src/core/HttpClient';
import { REQUEST_BUILDER_ERROR_CODES } from '../../src/constants';
import { RequestBuilderError } from '../../src/errors';
import { IHttpClientAdapter, IHttpClientOptions, TRequestBuilderErrorCode } from '../../src/types';

function createAdapter(): IHttpClientAdapter {
    return {
        request: vi.fn()
    };
}

function createOptions(): IHttpClientOptions {
    return { adapter: createAdapter() };
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

describe('HttpClient constructor', () => {
    test.each([
        {
            name: 'options object',
            options: undefined,
            code: REQUEST_BUILDER_ERROR_CODES.INVALID_CONFIG
        },
        {
            name: 'adapter',
            options: { adapter: {} },
            code: REQUEST_BUILDER_ERROR_CODES.INVALID_ADAPTER
        },
        {
            name: 'base URL',
            options: { ...createOptions(), baseUrl: '   ' },
            code: REQUEST_BUILDER_ERROR_CODES.INVALID_BASE_URL
        },
        {
            name: 'headers',
            options: { ...createOptions(), headers: { 'Bad Header': 'value' } },
            code: REQUEST_BUILDER_ERROR_CODES.INVALID_HEADER
        },
        {
            name: 'params',
            options: { ...createOptions(), params: { page: Number.NaN } },
            code: REQUEST_BUILDER_ERROR_CODES.INVALID_PARAM
        },
        {
            name: 'timeout',
            options: { ...createOptions(), timeout: -1 },
            code: REQUEST_BUILDER_ERROR_CODES.INVALID_TIMEOUT
        },
        {
            name: 'onRequest hook',
            options: { ...createOptions(), onRequest: true },
            code: REQUEST_BUILDER_ERROR_CODES.INVALID_HOOK
        },
        {
            name: 'onRequestError hook',
            options: { ...createOptions(), onRequestError: true },
            code: REQUEST_BUILDER_ERROR_CODES.INVALID_HOOK
        },
        {
            name: 'onResponse hook',
            options: { ...createOptions(), onResponse: true },
            code: REQUEST_BUILDER_ERROR_CODES.INVALID_HOOK
        },
        {
            name: 'onResponseError hook',
            options: { ...createOptions(), onResponseError: true },
            code: REQUEST_BUILDER_ERROR_CODES.INVALID_HOOK
        }
    ])('rejects invalid $name', ({ options, code }) => {
        expectRequestBuilderError(() => new HttpClient(options as unknown as IHttpClientOptions), code);
    });

    test('accepts valid options', () => {
        const options: IHttpClientOptions = {
            adapter: createAdapter(),
            baseUrl: 'https://example.test',
            headers: { 'X-Default': 'value' },
            params: { locale: 'ru' },
            timeout: 1000,
            onRequest: config => config,
            onRequestError: () => undefined,
            onResponse: response => response,
            onResponseError: () => undefined
        };

        expect(() => new HttpClient(options)).not.toThrow();
    });

    test('uses FetchAdapter when adapter is omitted', async () => {
        const fetchMock = vi.fn(() =>
            Promise.resolve(
                new Response(JSON.stringify({ ok: true }), {
                    status: 200,
                    statusText: 'OK',
                    headers: { 'Content-Type': 'application/json' }
                })
            )
        );
        vi.stubGlobal('fetch', fetchMock);

        try {
            const response = await new HttpClient({}).get('https://example.test/health').execute<{ ok: boolean }>();

            expect(response.data).toEqual({ ok: true });
            expect(fetchMock).toHaveBeenCalledWith(
                'https://example.test/health',
                expect.objectContaining({ method: 'GET' })
            );
        } finally {
            vi.unstubAllGlobals();
        }
    });
});
