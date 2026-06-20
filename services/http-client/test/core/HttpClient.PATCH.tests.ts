import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { HttpClient } from '../../src/core/HttpClient';
import { FetchAdapter } from '../../src/adapters/FetchAdapter';
import { XhrAdapter } from '../../src/adapters/XhrAdapter';
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

describe.each(adapters)('HttpClient.$name — PATCH', ({ create }) => {
    function createClient(): HttpClient {
        return new HttpClient({
            adapter: create(),
            baseUrl: BASE_URL,
            headers: { 'X-Default': 'default-header' }
        });
    }

    test('sends JSON body and receives patched data', async () => {
        server.use(
            http.patch(`${BASE_URL}/items/1`, async ({ request }) => {
                const body = await request.json();
                return HttpResponse.json({ patched: true, ...body });
            })
        );

        const client = createClient();
        const response = await client
            .patch('/items/1')
            .body({ name: 'Patched' })
            .execute<{ patched: boolean; name: string }>();

        expect(response.data).toEqual({ patched: true, name: 'Patched' });
    });
});