import { setupServer } from 'msw/node';
import { HttpClient } from '../../src/core/HttpClient';
import { FetchAdapter } from '../../src/adapters/FetchAdapter';
import { XhrAdapter } from '../../src/adapters/XhrAdapter';
import { HTTP_STATUS_CODES } from '../../src/constants';
import { HttpError, NetworkError } from '../../src/errors';
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
            headers: { 'X-Default': 'default-header' }
        });
    }

    test('merges default headers with request headers', async () => {
        const client = createClient();
        const response = await client
            .get('/test')
            .header('X-Custom', 'value')
            .execute<{ def: string | null; custom: string | null }>();

        expect(response.data.def).toBe('default-header');
        expect(response.data.custom).toBe('value');
    });

    test('request headers override default headers', async () => {
        const client = createClient();
        const response = await client
            .get('/test')
            .header('X-Default', 'overridden')
            .execute<{ def: string | null; custom: string | null }>();

        expect(response.data.def).toBe('overridden');
    });

    test('uses default baseUrl', async () => {
        const client = createClient();
        const response = await client.get('/base-test').execute<{ ok: boolean }>();

        expect(response.data.ok).toBe(true);
    });

    test('throws HttpError on 500', async () => {
        const client = createClient();

        try {
            await client.get('/server-error').execute();
            expect.fail('Should have thrown');
        } catch (error) {
            expect(error).toBeInstanceOf(HttpError);
            expect((error as HttpError).statusCode).toBe(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
        }
    });

    test('throws NetworkError on network failure', async () => {
        const client = createClient();

        try {
            await client.get('/network-error').execute();
            expect.fail('Should have thrown');
        } catch (error) {
            expect(error).toBeInstanceOf(NetworkError);
        }
    });
});