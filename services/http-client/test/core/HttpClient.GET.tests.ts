import { setupServer } from 'msw/node';
import { HttpClient } from '../../src/core/HttpClient';
import { FetchAdapter } from '../../src/adapters/FetchAdapter';
import { XhrAdapter } from '../../src/adapters/XhrAdapter';
import { HTTP_RESPONSE_TYPES, HTTP_STATUS_CODES } from '../../src/constants';
import { HttpError } from '../../src/errors';
import { IHttpClientAdapter } from '../../src/types';
import { handlers } from '../__handlers__/HttpClient.GET.handlers';
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

describe.each(adapters)('HttpClient.$name — GET', ({ create }) => {
    function createClient(): HttpClient {
        return new HttpClient({
            adapter: create(),
            baseUrl: BASE_URL,
            headers: { 'X-Default': 'default-header' }
        });
    }

    test('returns parsed JSON with status and statusText', async () => {
        const client = createClient();
        const response = await client.get('/users/1').execute<{ id: number; name: string }>();

        expect(response.data).toEqual({ id: 1, name: 'John' });
        expect(response.status).toBe(HTTP_STATUS_CODES.OK);
        expect(response.statusText).toBe('OK');
    });

    test('sends query params including arrays', async () => {
        const client = createClient();
        const response = await client
            .get('/users')
            .params({ page: '2', role: ['admin', 'user'] })
            .execute<{ page: string | null; role: string[] }>();

        expect(response.data.page).toBe('2');
        expect(response.data.role).toEqual(['admin', 'user']);
    });

    test('sends custom headers', async () => {
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
        const client = createClient();
        const response = await client.get('/text').responseType('text').execute<string>();

        expect(response.data).toBe('hello world');
    });

    test('returns ArrayBuffer when responseType is arrayBuffer', async () => {
        const client = createClient();
        const response = await client
            .get('/binary')
            .responseType(HTTP_RESPONSE_TYPES.ARRAY_BUFFER)
            .execute<ArrayBuffer>();

        expect(response.data).toBeInstanceOf(ArrayBuffer);
        expect(Array.from(new Uint8Array(response.data as ArrayBuffer))).toEqual([1, 2, 3, 4]);
    });

    test('throws HttpError with statusCode and data on 404', async () => {
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
