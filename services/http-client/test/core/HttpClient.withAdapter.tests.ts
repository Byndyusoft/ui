import { HTTP_STATUS_CODES, REQUEST_BUILDER_ERROR_CODES } from '../../src/constants';
import { HttpClient } from '../../src/core/HttpClient';
import { RequestBuilderError } from '../../src/errors';
import { IHttpClientAdapter, IHttpRequestConfig, IHttpResponse, TRequestBuilderErrorCode } from '../../src/types';

function createCapturingAdapter(): { adapter: IHttpClientAdapter; configs: IHttpRequestConfig[] } {
    const configs: IHttpRequestConfig[] = [];
    const adapter: IHttpClientAdapter = {
        request<T>(config: IHttpRequestConfig): Promise<IHttpResponse<T>> {
            configs.push(config);

            return Promise.resolve({
                status: HTTP_STATUS_CODES.OK,
                statusText: 'OK',
                headers: {},
                config
            });
        }
    };

    return { adapter, configs };
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

describe('HttpClient.withAdapter', () => {
    test('creates an independent client with the provided adapter and inherited defaults', async () => {
        const original = createCapturingAdapter();
        const replacement = createCapturingAdapter();
        const client = new HttpClient({
            adapter: original.adapter,
            baseUrl: 'https://api.example.test',
            headers: { 'X-Default': 'default' },
            params: { locale: 'ru' },
            timeout: 1000,
            withCredentials: true
        });

        const scopedClient = client.withAdapter(replacement.adapter);

        expect(scopedClient).not.toBe(client);

        await scopedClient.get('/scoped').execute();
        await client.get('/original').execute();

        expect(replacement.configs).toEqual([
            expect.objectContaining({
                url: '/scoped',
                baseUrl: 'https://api.example.test',
                headers: { 'X-Default': 'default' },
                params: { locale: 'ru' },
                timeout: 1000,
                withCredentials: true
            })
        ]);
        expect(original.configs).toEqual([expect.objectContaining({ url: '/original' })]);
    });

    test('snapshots current hooks and allows clients to replace them independently', async () => {
        const original = createCapturingAdapter();
        const replacement = createCapturingAdapter();
        const client = new HttpClient({ adapter: original.adapter }).onRequest(config => ({
            ...config,
            headers: { ...config.headers, 'X-Hook': 'snapshot' }
        }));
        const scopedClient = client.withAdapter(replacement.adapter);

        client.onRequest(config => ({
            ...config,
            headers: { ...config.headers, 'X-Hook': 'original' }
        }));

        await scopedClient.get('/scoped').execute();
        await client.get('/original').execute();

        expect(replacement.configs[0]?.headers).toMatchObject({ 'X-Hook': 'snapshot' });
        expect(original.configs[0]?.headers).toMatchObject({ 'X-Hook': 'original' });

        scopedClient.onRequest(config => ({
            ...config,
            headers: { ...config.headers, 'X-Hook': 'scoped' }
        }));

        await scopedClient.get('/scoped-again').execute();
        await client.get('/original-again').execute();

        expect(replacement.configs[1]?.headers).toMatchObject({ 'X-Hook': 'scoped' });
        expect(original.configs[1]?.headers).toMatchObject({ 'X-Hook': 'original' });
    });

    test.each([
        { name: 'undefined', adapter: undefined },
        { name: 'an invalid object', adapter: {} }
    ])('rejects $name instead of falling back to FetchAdapter', ({ adapter }) => {
        const client = new HttpClient({});

        expectRequestBuilderError(
            () => client.withAdapter(adapter as unknown as IHttpClientAdapter),
            REQUEST_BUILDER_ERROR_CODES.INVALID_ADAPTER
        );
    });
});
