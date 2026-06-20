import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { HttpClient } from '../../src/core/HttpClient';
import { FetchAdapter } from '../../src/adapters/FetchAdapter';
import { XhrAdapter } from '../../src/adapters/XhrAdapter';
import { HTTP_STATUS_CODES } from '../../src/constants';
import { IHttpClientAdapter } from '../../src/types';

const BASE_URL = 'https://api.test.com';

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const adapters: Array<{ name: string; create: () => IHttpClientAdapter }> = [
    { name: 'FetchAdapter', create: () => new FetchAdapter() },
    { name: 'XhrAdapter', create: () => new XhrAdapter() }
];

describe.each(adapters)('HttpClient.$name — OPTIONS', ({ create }) => {
    function createClient(): HttpClient {
        return new HttpClient({
            adapter: create(),
            baseUrl: BASE_URL,
            headers: { 'X-Default': 'default-header' }
        });
    }

    test('returns Allow header', async () => {
        server.use(
            http.options(`${BASE_URL}/items`, () => {
                return new HttpResponse(null, {
                    status: 204,
                    headers: { Allow: 'GET, POST, HEAD, OPTIONS' }
                });
            })
        );

        const client = createClient();
        const response = await client.options('/items').responseType('text').execute();

        expect(response.status).toBe(HTTP_STATUS_CODES.NO_CONTENT);
        expect(response.headers['allow']).toBe('GET, POST, HEAD, OPTIONS');
    });
});