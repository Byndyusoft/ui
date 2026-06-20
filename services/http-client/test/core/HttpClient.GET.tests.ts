import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { HttpClient } from '../../src/core/HttpClient';
import { FetchAdapter } from '../../src/adapters/FetchAdapter';
import { XhrAdapter } from '../../src/adapters/XhrAdapter';
import { HTTP_STATUS_CODES } from '../../src/constants';
import { HttpError } from '../../src/errors';
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

describe.each(adapters)('HttpClient.$name — GET', ({ create }) => {
    function createClient(): HttpClient {
        return new HttpClient({
            adapter: create(),
            baseUrl: BASE_URL,
            headers: { 'X-Default': 'default-header' }
        });
    }

    test('returns parsed JSON with status and statusText', async () => {
        server.use(
            http.get(`${BASE_URL}/users/1`, () => {
                return HttpResponse.json({ id: 1, name: 'John' });
            })
        );

        const client = createClient();
        const response = await client.get('/users/1').execute<{ id: number; name: string }>();

        expect(response.data).toEqual({ id: 1, name: 'John' });
        expect(response.status).toBe(HTTP_STATUS_CODES.OK);
        expect(response.statusText).toBe('OK');
    });

    test('sends query params including arrays', async () => {
        server.use(
            http.get(`${BASE_URL}/users`, ({ request }) => {
                const url = new URL(request.url);
                return HttpResponse.json({
                    page: url.searchParams.get('page'),
                    role: url.searchParams.getAll('role')
                });
            })
        );

        const client = createClient();
        const response = await client
            .get('/users')
            .params({ page: '2', role: ['admin', 'user'] })
            .execute<{ page: string | null; role: string[] }>();

        expect(response.data.page).toBe('2');
        expect(response.data.role).toEqual(['admin', 'user']);
    });

    test('sends custom headers', async () => {
        server.use(
            http.get(`${BASE_URL}/headers`, ({ request }) => {
                return HttpResponse.json({
                    auth: request.headers.get('authorization'),
                    custom: request.headers.get('x-custom')
                });
            })
        );

        const client = createClient();
        const response = await client
            .get('/headers')
            .header('Authorization', 'Bearer token')
            .header('X-Custom', 'value')
            .execute<{ auth: string | null; custom: string | null }>();

        expect(response.data.auth).toBe('Bearer token');
        expect(response.data.custom).toBe('value');
    });

    test('returns text when responseType is text', async () => {
        server.use(
            http.get(`${BASE_URL}/text`, () => {
                return new HttpResponse('hello world', { headers: { 'Content-Type': 'text/plain' } });
            })
        );

        const client = createClient();
        const response = await client.get('/text').responseType('text').execute<string>();

        expect(response.data).toBe('hello world');
    });

    test('throws HttpError with statusCode and data on 404', async () => {
        server.use(
            http.get(`${BASE_URL}/not-found`, () => {
                return HttpResponse.json({ error: 'Not found' }, { status: 404 });
            })
        );

        const client = createClient();

        try {
            await client.get('/not-found').execute();
            expect.fail('Should have thrown');
        } catch (error) {
            expect(error).toBeInstanceOf(HttpError);
            expect((error as HttpError).statusCode).toBe(HTTP_STATUS_CODES.NOT_FOUND);
            expect((error as HttpError).data).toEqual({ error: 'Not found' });
        }
    });
});