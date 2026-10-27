import {
    FetchAdapter,
    HttpClient,
    IFetchAdapterOptions,
    IHttpRequestConfig,
    IXhrAdapterOptions,
    XhrAdapter
} from '../../src';

describe('adapter option types', () => {
    it('accepts supported Fetch and XHR options', () => {
        const fetchOptions: IFetchAdapterOptions = {
            cache: 'no-store',
            credentials: 'omit',
            integrity: 'sha256-test',
            keepalive: true,
            mode: 'cors',
            redirect: 'error',
            referrer: 'https://app.example.test',
            referrerPolicy: 'no-referrer'
        };
        const xhrOptions: IXhrAdapterOptions = {
            mimeType: 'application/json',
            responseType: 'text',
            timeout: 1000,
            withCredentials: true,
            onDownloadProgress: (event, config) => {
                expectTypeOf(event).toEqualTypeOf<ProgressEvent>();
                expectTypeOf(config).toEqualTypeOf<Readonly<IHttpRequestConfig>>();
            },
            onUploadProgress: (event, config) => {
                expectTypeOf(event).toEqualTypeOf<ProgressEvent>();
                expectTypeOf(config).toEqualTypeOf<Readonly<IHttpRequestConfig>>();
            }
        };
        const client = new HttpClient({ adapter: new FetchAdapter() });

        expectTypeOf(new FetchAdapter(fetchOptions)).toEqualTypeOf<FetchAdapter>();
        expectTypeOf(new XhrAdapter(xhrOptions)).toEqualTypeOf<XhrAdapter>();
        expectTypeOf(client.withAdapter(new XhrAdapter(xhrOptions))).toEqualTypeOf<HttpClient>();
        expectTypeOf<NonNullable<IFetchAdapterOptions['mode']>>().toEqualTypeOf<'cors' | 'no-cors' | 'same-origin'>();
    });
});
