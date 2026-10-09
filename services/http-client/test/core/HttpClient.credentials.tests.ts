import { FetchAdapter } from '../../src/adapters/FetchAdapter';
import { XhrAdapter } from '../../src/adapters/XhrAdapter';
import { HttpClient } from '../../src/core/HttpClient';
import { HTTP_STATUS_CODES } from '../../src/constants';
import { IHttpClientAdapter, IHttpRequestConfig, IHttpResponse } from '../../src/types';

function createResponse<T>(config: IHttpRequestConfig): IHttpResponse<T> {
    return {
        status: HTTP_STATUS_CODES.OK,
        statusText: 'OK',
        headers: {},
        config
    };
}

function createMockXhr(): XMLHttpRequest {
    const xhr = {
        status: HTTP_STATUS_CODES.OK,
        statusText: 'OK',
        response: '{}',
        responseText: '{}',
        responseType: '',
        timeout: 0,
        withCredentials: false,
        onload: null,
        onerror: null,
        onabort: null,
        ontimeout: null,
        open: vi.fn(),
        setRequestHeader: vi.fn(),
        send: vi.fn(),
        abort: vi.fn(),
        getAllResponseHeaders: vi.fn(() => ''),
        getResponseHeader: vi.fn(() => null)
    } as unknown as XMLHttpRequest;

    xhr.send = vi.fn(() => {
        xhr.onload?.(new ProgressEvent('load'));
    });

    return xhr;
}

describe('HttpClient credentials', () => {
    test('inherits and overrides default withCredentials', async () => {
        const configs: IHttpRequestConfig[] = [];
        const adapter: IHttpClientAdapter = {
            request<T>(config: IHttpRequestConfig): Promise<IHttpResponse<T>> {
                configs.push(config);

                return Promise.resolve(createResponse<T>(config));
            }
        };
        const client = new HttpClient({ adapter, withCredentials: true });

        await client.get('/items').execute();
        await client.get('/items').withCredentials(false).execute();

        expect(configs.map(config => config.withCredentials)).toEqual([true, false]);
    });

    test('passes include credentials to Fetch', async () => {
        const fetchMock = vi.fn(() => Promise.resolve(new Response(null, { status: HTTP_STATUS_CODES.NO_CONTENT })));
        vi.stubGlobal('fetch', fetchMock);

        try {
            await new HttpClient({ adapter: new FetchAdapter(), withCredentials: true })
                .get('https://example.test/items')
                .execute();

            expect(fetchMock).toHaveBeenCalledWith(
                'https://example.test/items',
                expect.objectContaining({ credentials: 'include' })
            );
        } finally {
            vi.unstubAllGlobals();
        }
    });

    test('passes withCredentials to XHR', async () => {
        const xhr = createMockXhr();
        vi.stubGlobal(
            'XMLHttpRequest',
            vi.fn(() => xhr)
        );

        try {
            await new HttpClient({ adapter: new XhrAdapter(), withCredentials: true })
                .get('https://example.test/items')
                .execute();

            expect(xhr.withCredentials).toBe(true);
        } finally {
            vi.unstubAllGlobals();
        }
    });
});
