import { setupServer } from 'msw/node';
import { HttpClient } from '../../src/core/HttpClient';
import { FetchAdapter } from '../../src/adapters/FetchAdapter';
import { XhrAdapter } from '../../src/adapters/XhrAdapter';
import { HTTP_STATUS_CODES } from '../../src/constants';
import { HttpResponseError, NetworkError } from '../../src/errors';
import { IHttpClientAdapter } from '../../src/types';
import { handlers } from '../__handlers__/HttpClient.defaultConfig.handlers';
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

describe.each(adapters)('HttpClient.$name — default config', ({ create }) => {
    function createClient(): HttpClient {
        return new HttpClient({
            adapter: create(),
            baseUrl: BASE_URL,
            headers: { 'X-Default': 'default-header', Authorization: 'Bearer default' }
        });
    }

    test('merges default headers with request headers', async () => {
        const client = createClient();
        const response = await client
            .get('/test')
            .header('X-Custom', 'value')
            .execute<{ def: string | null; custom: string | null }>();

        expect(response.data?.def).toBe('default-header');
        expect(response.data?.custom).toBe('value');
    });

    test('request headers override default headers', async () => {
        const client = createClient();
        const response = await client
            .get('/test')
            .header('X-Default', 'overridden')
            .execute<{ def: string | null; custom: string | null }>();

        expect(response.data?.def).toBe('overridden');
    });

    test('request headers override default headers regardless of casing', async () => {
        const client = createClient();
        const response = await client
            .get('/test')
            .header('authorization', 'Bearer request')
            .execute<{ authorization: string | null }>();

        expect(response.data?.authorization).toBe('Bearer request');
    });

    test('sends default params with every request', async () => {
        const client = new HttpClient({
            adapter: create(),
            baseUrl: BASE_URL,
            params: { locale: 'ru', page: '1', role: ['admin', 'editor'] }
        });

        const response = await client
            .get('/test')
            .execute<{ locale: string | null; page: string | null; role: string[] }>();

        expect(response.data).toMatchObject({ locale: 'ru', page: '1', role: ['admin', 'editor'] });
    });

    test('request params override default params with the same key', async () => {
        const client = new HttpClient({
            adapter: create(),
            baseUrl: BASE_URL,
            params: { locale: 'ru', page: '1', role: ['admin'] }
        });

        const response = await client
            .get('/test')
            .params({ page: '2', role: ['editor'] })
            .execute<{ locale: string | null; page: string | null; role: string[] }>();

        expect(response.data).toMatchObject({ locale: 'ru', page: '2', role: ['editor'] });
    });

    test('copies default params when the client is created', async () => {
        const params = { locale: 'ru', role: ['admin'] };
        const client = new HttpClient({ adapter: create(), baseUrl: BASE_URL, params });

        params.locale = 'en';
        params.role.push('editor');

        const response = await client.get('/test').execute<{ locale: string | null; role: string[] }>();

        expect(response.data).toMatchObject({ locale: 'ru', role: ['admin'] });
    });

    test('uses default baseUrl', async () => {
        const client = createClient();
        const response = await client.get('/base-test').execute<{ ok: boolean }>();

        expect(response.data?.ok).toBe(true);
    });

    test('throws HttpResponseError on 500', async () => {
        const client = createClient();

        try {
            await client.get('/server-error').execute();
            expect.fail('Should have thrown');
        } catch (error) {
            expect(error).toBeInstanceOf(HttpResponseError);
            expect((error as HttpResponseError).status).toBe(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
        }
    });

    test('throws NetworkError on network failure', async () => {
        const client = createClient();

        try {
            await client.get('/network-error').execute();
            expect.fail('Should have thrown');
        } catch (error) {
            expect(error).toBeInstanceOf(NetworkError);
            expect((error as NetworkError).config).toMatchObject({ url: '/network-error', baseUrl: BASE_URL });
        }
    });
});
