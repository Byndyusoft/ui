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

describe.each(adapters)('HttpClient.$name — POST', ({ create }) => {
    function createClient(): HttpClient {
        return new HttpClient({
            adapter: create(),
            baseUrl: BASE_URL,
            headers: { 'X-Default': 'default-header' }
        });
    }

    test('sends JSON body with auto Content-Type', async () => {
        server.use(
            http.post(`${BASE_URL}/items`, async ({ request }) => {
                const contentType = request.headers.get('content-type');
                const body = await request.json();
                return HttpResponse.json({ received: body, contentType });
            })
        );

        const client = createClient();
        const response = await client
            .post('/items')
            .body({ name: 'New item' })
            .execute<{ received: { name: string }; contentType: string | null }>();

        expect(response.data.received).toEqual({ name: 'New item' });
        expect(response.data.contentType).toBe('application/json');
    });

    test('sends string body without overriding Content-Type', async () => {
        server.use(
            http.post(`${BASE_URL}/raw`, async ({ request }) => {
                const contentType = request.headers.get('content-type');
                const body = await request.text();
                return HttpResponse.json({ received: body, contentType });
            })
        );

        const client = createClient();
        const response = await client
            .post('/raw')
            .body('plain text body')
            .header('Content-Type', 'text/plain')
            .execute<{ received: string; contentType: string | null }>();

        expect(response.data.received).toBe('plain text body');
        expect(response.data.contentType).toBe('text/plain');
    });

    test('echoes body back', async () => {
        server.use(
            http.post(`${BASE_URL}/echo`, async ({ request }) => {
                const body = await request.json();
                return HttpResponse.json({ created: true, ...body });
            })
        );

        const client = createClient();
        const response = await client
            .post('/echo')
            .body({ name: 'Jane' })
            .execute<{ created: boolean; name: string }>();

        expect(response.data).toEqual({ created: true, name: 'Jane' });
    });
});