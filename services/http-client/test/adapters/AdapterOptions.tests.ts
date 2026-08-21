import { FetchAdapter } from '../../src/adapters/FetchAdapter';
import { XhrAdapter } from '../../src/adapters/XhrAdapter';
import { HTTP_RESPONSE_TYPES, HTTP_STATUS_CODES, REQUEST_BUILDER_ERROR_CODES } from '../../src/constants';
import { HttpClient } from '../../src/core/HttpClient';
import { RequestBuilderError } from '../../src/errors';
import { IFetchAdapterOptions, TRequestBuilderErrorCode } from '../../src/types';

function createMockXhr(response: unknown = 'response'): {
    xhr: XMLHttpRequest;
    overrideMimeType: ReturnType<typeof vi.fn>;
} {
    const overrideMimeType = vi.fn();
    const xhr = {
        status: HTTP_STATUS_CODES.OK,
        statusText: 'OK',
        response,
        responseText: typeof response === 'string' ? response : '',
        responseType: '',
        timeout: 0,
        withCredentials: false,
        onload: null,
        onerror: null,
        onabort: null,
        ontimeout: null,
        open: vi.fn(),
        overrideMimeType,
        setRequestHeader: vi.fn(),
        send: vi.fn(),
        abort: vi.fn(),
        getAllResponseHeaders: vi.fn(() => ''),
        getResponseHeader: vi.fn(() => null)
    } as unknown as XMLHttpRequest;

    xhr.send = vi.fn(() => {
        xhr.onload?.(new ProgressEvent('load'));
    });

    return { xhr, overrideMimeType };
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

describe('adapter constructor options', () => {
    test('passes Fetch adapter options to fetch', async () => {
        const fetchMock = vi.fn(() => Promise.resolve(new Response(null, { status: HTTP_STATUS_CODES.NO_CONTENT })));
        vi.stubGlobal('fetch', fetchMock);

        try {
            const adapter = new FetchAdapter({
                cache: 'no-store',
                credentials: 'omit',
                integrity: 'sha256-test',
                keepalive: true,
                mode: 'cors',
                redirect: 'error',
                referrer: 'https://app.example.test',
                referrerPolicy: 'no-referrer'
            });

            await new HttpClient({ adapter }).get('https://api.example.test/items').execute();

            expect(fetchMock).toHaveBeenCalledWith(
                'https://api.example.test/items',
                expect.objectContaining({
                    cache: 'no-store',
                    credentials: 'omit',
                    integrity: 'sha256-test',
                    keepalive: true,
                    mode: 'cors',
                    redirect: 'error',
                    referrer: 'https://app.example.test',
                    referrerPolicy: 'no-referrer'
                })
            );
        } finally {
            vi.unstubAllGlobals();
        }
    });

    test('request credentials override Fetch adapter credentials', async () => {
        const fetchMock = vi.fn(() => Promise.resolve(new Response(null, { status: HTTP_STATUS_CODES.NO_CONTENT })));
        vi.stubGlobal('fetch', fetchMock);

        try {
            const adapter = new FetchAdapter({ credentials: 'omit' });

            await new HttpClient({ adapter, withCredentials: true }).get('https://api.example.test/items').execute();

            expect(fetchMock).toHaveBeenCalledWith(
                'https://api.example.test/items',
                expect.objectContaining({ credentials: 'include' })
            );
        } finally {
            vi.unstubAllGlobals();
        }
    });

    test('accepts only-if-cached with same-origin mode', () => {
        expect(() => new FetchAdapter({ cache: 'only-if-cached', mode: 'same-origin' })).not.toThrow();
    });

    test('uses XHR adapter defaults when the request does not set them', async () => {
        const mockXhr = createMockXhr();
        vi.stubGlobal(
            'XMLHttpRequest',
            vi.fn(() => mockXhr.xhr)
        );

        try {
            const adapter = new XhrAdapter({
                mimeType: 'application/json',
                responseType: HTTP_RESPONSE_TYPES.TEXT,
                timeout: 1000,
                withCredentials: true
            });

            const response = await new HttpClient({ adapter }).get('https://api.example.test/items').execute<string>();

            expect(mockXhr.xhr.withCredentials).toBe(true);
            expect(mockXhr.xhr.timeout).toBe(1000);
            expect(mockXhr.xhr.responseType).toBe('text');
            expect(mockXhr.overrideMimeType).toHaveBeenCalledWith('application/json');
            expect(response.config).toMatchObject({
                responseType: HTTP_RESPONSE_TYPES.TEXT,
                timeout: 1000,
                withCredentials: true
            });
        } finally {
            vi.unstubAllGlobals();
        }
    });

    test('request configuration overrides XHR adapter defaults', async () => {
        const mockXhr = createMockXhr(new ArrayBuffer(0));
        vi.stubGlobal(
            'XMLHttpRequest',
            vi.fn(() => mockXhr.xhr)
        );

        try {
            const adapter = new XhrAdapter({
                responseType: HTTP_RESPONSE_TYPES.TEXT,
                timeout: 1000,
                withCredentials: true
            });

            const response = await new HttpClient({ adapter })
                .get('https://api.example.test/items')
                .responseType(HTTP_RESPONSE_TYPES.ARRAY_BUFFER)
                .timeout(50)
                .withCredentials(false)
                .execute<ArrayBuffer>();

            expect(mockXhr.xhr.withCredentials).toBe(false);
            expect(mockXhr.xhr.timeout).toBe(50);
            expect(mockXhr.xhr.responseType).toBe('arraybuffer');
            expect(response.config).toMatchObject({
                responseType: HTTP_RESPONSE_TYPES.ARRAY_BUFFER,
                timeout: 50,
                withCredentials: false
            });
        } finally {
            vi.unstubAllGlobals();
        }
    });

    test.each([
        {
            name: 'Fetch options object',
            action: () => new FetchAdapter(null as unknown as Record<string, never>),
            code: REQUEST_BUILDER_ERROR_CODES.INVALID_FETCH_ADAPTER_OPTIONS
        },
        {
            name: 'unsupported Fetch mode',
            action: () => new FetchAdapter({ mode: 'unsupported' } as unknown as IFetchAdapterOptions),
            code: REQUEST_BUILDER_ERROR_CODES.INVALID_FETCH_ADAPTER_OPTIONS
        },
        {
            name: 'navigate Fetch mode',
            action: () => new FetchAdapter({ mode: 'navigate' } as unknown as IFetchAdapterOptions),
            code: REQUEST_BUILDER_ERROR_CODES.INVALID_FETCH_ADAPTER_OPTIONS
        },
        {
            name: 'only-if-cached Fetch cache without same-origin mode',
            action: () => new FetchAdapter({ cache: 'only-if-cached' }),
            code: REQUEST_BUILDER_ERROR_CODES.INVALID_FETCH_ADAPTER_OPTIONS
        },
        {
            name: 'XHR mime type',
            action: () => new XhrAdapter({ mimeType: '  ' }),
            code: REQUEST_BUILDER_ERROR_CODES.INVALID_XHR_ADAPTER_OPTIONS
        },
        {
            name: 'XHR timeout',
            action: () => new XhrAdapter({ timeout: -1 }),
            code: REQUEST_BUILDER_ERROR_CODES.INVALID_TIMEOUT
        }
    ])('rejects invalid $name', ({ action, code }) => {
        expectRequestBuilderError(action, code);
    });
});
