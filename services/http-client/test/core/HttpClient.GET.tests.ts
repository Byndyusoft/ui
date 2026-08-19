import { setupServer } from 'msw/node';
import { HttpClient } from '../../src/core/HttpClient';
import { FetchAdapter } from '../../src/adapters/FetchAdapter';
import { XhrAdapter } from '../../src/adapters/XhrAdapter';
import { HTTP_RESPONSE_TYPES, HTTP_STATUS_CODES } from '../../src/constants';
import { HttpResponseError, ParseError } from '../../src/errors';
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

        expect(response.data?.page).toBe('2');
        expect(response.data?.role).toEqual(['admin', 'user']);
    });

    test('preserves an existing query and appends params before a fragment', async () => {
        const client = createClient();
        const response = await client
            .get('/users?source=existing#fragment')
            .param('page', '2')
            .execute<{ page: string | null; source: string | null }>();

        expect(response.data?.source).toBe('existing');
        expect(response.data?.page).toBe('2');
    });

    test('joins baseUrl and request paths without duplicate or missing slashes', async () => {
        const client = new HttpClient({ adapter: create(), baseUrl: `${BASE_URL}/api/` });
        const response = await client.get('/users').execute<{ scoped: boolean }>();

        expect(response.data?.scoped).toBe(true);
    });

    test('sends custom headers', async () => {
        const client = createClient();
        const response = await client
            .get('/headers')
            .header('Authorization', 'Bearer token')
            .header('X-Custom', 'value')
            .execute<{ auth: string | null; custom: string | null }>();

        expect(response.data?.auth).toBe('Bearer token');
        expect(response.data?.custom).toBe('value');
    });

    test('overrides request headers case-insensitively', async () => {
        const client = createClient();
        const response = await client
            .get('/headers')
            .header('Authorization', 'Bearer first')
            .header('authorization', 'Bearer second')
            .execute<{ auth: string | null }>();

        expect(response.data?.auth).toBe('Bearer second');
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

    test('returns FormData when responseType is formData', async () => {
        const client = createClient();
        const response = await client.get('/form-data').responseType(HTTP_RESPONSE_TYPES.FORM_DATA).execute<FormData>();

        expect(response.data?.get('name')).toBe('John');
        expect(response.data?.getAll('role')).toEqual(['admin', 'editor']);
    });

    test('returns a readable stream when responseType is stream', async () => {
        const client = createClient();
        const response = await client
            .get('/stream')
            .responseType(HTTP_RESPONSE_TYPES.STREAM)
            .execute<ReadableStream<Uint8Array>>();

        if (response.data === undefined) {
            throw new Error('Expected stream response data');
        }

        expect(response.data).toBeInstanceOf(ReadableStream);
        expect(await new Response(response.data).text()).toBe('stream response');
    });

    test('throws HttpResponseError with response context and data on 404', async () => {
        const client = createClient();

        try {
            await client.get('/not-found').execute();
            expect.fail('Should have thrown');
        } catch (error) {
            expect(error).toBeInstanceOf(HttpResponseError);
            const responseError = error as HttpResponseError;

            expect(responseError.status).toBe(HTTP_STATUS_CODES.NOT_FOUND);
            expect(responseError.statusText).toBe('Not Found');
            expect(responseError.headers['x-request-id']).toBe('request-1');
            expect(responseError.config).toMatchObject({ method: 'GET', url: '/not-found', baseUrl: BASE_URL });
            expect(responseError.data).toEqual({ error: 'Not found' });
        }
    });

    test('throws ParseError with its cause for malformed JSON', async () => {
        const client = createClient();

        try {
            await client.get('/invalid-json').execute();
            expect.fail('Should have thrown');
        } catch (error) {
            expect(error).toBeInstanceOf(ParseError);
            const parseError = error as ParseError;

            expect(parseError.cause).toBeInstanceOf(SyntaxError);
            expect(parseError.config).toMatchObject({ url: '/invalid-json', baseUrl: BASE_URL });
        }
    });
});
