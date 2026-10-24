import { FetchAdapter } from '../../src/adapters/FetchAdapter';
import { XhrAdapter } from '../../src/adapters/XhrAdapter';
import { HTTP_RESPONSE_TYPES, HTTP_STATUS_CODES, REQUEST_BUILDER_ERROR_CODES } from '../../src/constants';
import { HttpClient } from '../../src/core/HttpClient';
import { RequestBuilderError } from '../../src/errors';
import { IFetchAdapterOptions, IXhrAdapterOptions, TRequestBuilderErrorCode } from '../../src/types';

function createMockXhr(response: unknown = 'response'): {
    xhr: XMLHttpRequest;
    overrideMimeType: ReturnType<typeof vi.fn>;
    setReadyState(value: number): void;
    setResponseText(value: string): void;
} {
    const overrideMimeType = vi.fn();
    const state = {
        status: HTTP_STATUS_CODES.OK,
        statusText: 'OK',
        response,
        responseText: typeof response === 'string' ? response : '',
        responseType: '',
        readyState: XMLHttpRequest.DONE,
        timeout: 0,
        withCredentials: false,
        upload: { onprogress: null },
        onprogress: null,
        onreadystatechange: null,
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
    };
    const xhr = state as unknown as XMLHttpRequest;

    xhr.send = vi.fn(() => {
        xhr.onload?.(new ProgressEvent('load'));
    });

    return {
        xhr,
        overrideMimeType,
        setReadyState(value) {
            state.readyState = value;
        },
        setResponseText(value) {
            state.responseText = value;
        }
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

            const response = await new HttpClient({ adapter }).get('https://api.example.test/items').execute();

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
                .asArrayBuffer()
                .timeout(50)
                .withCredentials(false)
                .execute();

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

    test('reports XHR upload and download progress with the resolved request config', async () => {
        const mockXhr = createMockXhr();
        const onDownloadProgress = vi.fn();
        const onUploadProgress = vi.fn();
        const uploadEvent = new ProgressEvent('progress', {
            lengthComputable: true,
            loaded: 25,
            total: 100
        });
        const downloadEvent = new ProgressEvent('progress', {
            lengthComputable: true,
            loaded: 50,
            total: 100
        });
        vi.stubGlobal(
            'XMLHttpRequest',
            vi.fn(() => mockXhr.xhr)
        );
        mockXhr.xhr.send = vi.fn(() => {
            mockXhr.xhr.upload.onprogress?.call(mockXhr.xhr, uploadEvent);
            mockXhr.xhr.onprogress?.call(mockXhr.xhr, downloadEvent);
            mockXhr.xhr.onload?.call(mockXhr.xhr, new ProgressEvent('load'));
        });

        try {
            const adapter = new XhrAdapter({ onDownloadProgress, onUploadProgress });

            await new HttpClient({ adapter, timeout: 1000 })
                .post('https://api.example.test/items')
                .body('payload')
                .asText()
                .execute();

            expect(onUploadProgress).toHaveBeenCalledWith(
                uploadEvent,
                expect.objectContaining({
                    method: 'POST',
                    url: 'https://api.example.test/items',
                    data: 'payload',
                    responseType: HTTP_RESPONSE_TYPES.TEXT,
                    timeout: 1000
                })
            );
            expect(onDownloadProgress).toHaveBeenCalledWith(
                downloadEvent,
                expect.objectContaining({
                    method: 'POST',
                    url: 'https://api.example.test/items',
                    data: 'payload',
                    responseType: HTTP_RESPONSE_TYPES.TEXT,
                    timeout: 1000
                })
            );
        } finally {
            vi.unstubAllGlobals();
        }
    });

    test('does not attach an upload progress listener to a request without a body', async () => {
        const mockXhr = createMockXhr();
        vi.stubGlobal(
            'XMLHttpRequest',
            vi.fn(() => mockXhr.xhr)
        );

        try {
            const adapter = new XhrAdapter({ onUploadProgress: vi.fn() });

            await new HttpClient({ adapter }).get('https://api.example.test/items').asText().execute();

            expect(mockXhr.xhr.upload.onprogress).toBeNull();
        } finally {
            vi.unstubAllGlobals();
        }
    });

    test('does not attach an upload progress listener when the callback is omitted', async () => {
        const mockXhr = createMockXhr();
        vi.stubGlobal(
            'XMLHttpRequest',
            vi.fn(() => mockXhr.xhr)
        );

        try {
            await new HttpClient({ adapter: new XhrAdapter() })
                .post('https://api.example.test/items')
                .body('payload')
                .asText()
                .execute();

            expect(mockXhr.xhr.upload.onprogress).toBeNull();
        } finally {
            vi.unstubAllGlobals();
        }
    });

    test('reports download progress while preserving the XHR stream response', async () => {
        const mockXhr = createMockXhr('');
        const onDownloadProgress = vi.fn();
        const downloadEvent = new ProgressEvent('progress', {
            lengthComputable: true,
            loaded: 6,
            total: 6
        });
        vi.stubGlobal(
            'XMLHttpRequest',
            vi.fn(() => mockXhr.xhr)
        );
        mockXhr.xhr.send = vi.fn(() => {
            mockXhr.setReadyState(XMLHttpRequest.HEADERS_RECEIVED);
            mockXhr.xhr.onreadystatechange?.call(mockXhr.xhr, new Event('readystatechange'));
            mockXhr.setResponseText('stream');
            mockXhr.xhr.onprogress?.call(mockXhr.xhr, downloadEvent);
            mockXhr.setReadyState(XMLHttpRequest.DONE);
            mockXhr.xhr.onload?.call(mockXhr.xhr, new ProgressEvent('load'));
        });

        try {
            const response = await new HttpClient({ adapter: new XhrAdapter({ onDownloadProgress }) })
                .get('https://api.example.test/items')
                .asStream()
                .execute();

            if (response.data === undefined) {
                throw new Error('Expected stream response data');
            }

            expect(onDownloadProgress).toHaveBeenCalledWith(downloadEvent, response.config);
            expect(await new Response(response.data).text()).toBe('stream');
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
        },
        {
            name: 'XHR response type',
            action: () => new XhrAdapter({ responseType: 'invalid' } as unknown as IXhrAdapterOptions),
            code: REQUEST_BUILDER_ERROR_CODES.INVALID_RESPONSE_TYPE
        },
        {
            name: 'XHR download progress callback',
            action: () => new XhrAdapter({ onDownloadProgress: true } as unknown as IXhrAdapterOptions),
            code: REQUEST_BUILDER_ERROR_CODES.INVALID_XHR_ADAPTER_OPTIONS
        },
        {
            name: 'XHR upload progress callback',
            action: () => new XhrAdapter({ onUploadProgress: true } as unknown as IXhrAdapterOptions),
            code: REQUEST_BUILDER_ERROR_CODES.INVALID_XHR_ADAPTER_OPTIONS
        }
    ])('rejects invalid $name', ({ action, code }) => {
        expectRequestBuilderError(action, code);
    });
});
