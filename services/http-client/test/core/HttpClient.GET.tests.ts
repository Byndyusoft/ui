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

describe.each(adapters)('HttpClient.$name — GET', ({ name, create }) => {
    function createClient(): HttpClient {
        return new HttpClient({
            adapter: create(),
            baseUrl: BASE_URL,
            headers: { 'X-Default': 'default-header' }
        });
    }

    test('returns parsed JSON with status and statusText', async () => {
        const client = createClient();
        const response = await client.get('/users/1').asJson<{ id: number; name: string }>().execute();

        expect(response.data).toEqual({ id: 1, name: 'John' });
        expect(response.status).toBe(HTTP_STATUS_CODES.OK);
        expect(response.statusText).toBe('OK');
    });

    test('sends query params including arrays', async () => {
        const client = createClient();
        const response = await client
            .get('/users')
            .params({ page: '2', role: ['admin', 'user'] })
            .asJson<{ page: string | null; role: string[] }>()
            .execute();

        expect(response.data?.page).toBe('2');
        expect(response.data?.role).toEqual(['admin', 'user']);
    });

    test('sends numeric and boolean query params', async () => {
        const client = createClient();
        const response = await client
            .get('/users')
            .params({ page: 2, active: true, value: [0, false, 'all'] })
            .asJson<{ page: string | null; active: string | null; value: string[] }>()
            .execute();

        expect(response.data).toMatchObject({
            page: '2',
            active: 'true',
            value: ['0', 'false', 'all']
        });
    });

    test('omits null and undefined query params', async () => {
        const client = createClient();
        const response = await client
            .get('/users')
            .params({ page: 2, active: null, source: undefined, value: [1, null, undefined, 2] })
            .asJson<{
                page: string | null;
                active: string | null;
                source: string | null;
                value: string[];
                keys: string[];
            }>()
            .execute();

        expect(response.data).toMatchObject({
            page: '2',
            active: null,
            source: null,
            value: ['1', '2']
        });
        expect(response.data?.keys).toEqual(['page', 'value', 'value']);
    });

    test('preserves an existing query and appends params before a fragment', async () => {
        const client = createClient();
        const response = await client
            .get('/users?source=existing#fragment')
            .param('page', '2')
            .asJson<{ page: string | null; source: string | null }>()
            .execute();

        expect(response.data?.source).toBe('existing');
        expect(response.data?.page).toBe('2');
    });

    test('joins baseUrl and request paths without duplicate or missing slashes', async () => {
        const client = new HttpClient({ adapter: create(), baseUrl: `${BASE_URL}/api/` });
        const response = await client.get('/users').asJson<{ scoped: boolean }>().execute();

        expect(response.data?.scoped).toBe(true);
    });

    test('sends custom headers', async () => {
        const client = createClient();
        const response = await client
            .get('/headers')
            .header('Authorization', 'Bearer token')
            .header('X-Custom', 'value')
            .asJson<{ auth: string | null; custom: string | null }>()
            .execute();

        expect(response.data?.auth).toBe('Bearer token');
        expect(response.data?.custom).toBe('value');
    });

    test('overrides request headers case-insensitively', async () => {
        const client = createClient();
        const response = await client
            .get('/headers')
            .header('Authorization', 'Bearer first')
            .header('authorization', 'Bearer second')
            .asJson<{ auth: string | null }>()
            .execute();

        expect(response.data?.auth).toBe('Bearer second');
    });

    test('returns text when responseType is text', async () => {
        const client = createClient();
        const response = await client.get('/text').asText().execute();

        expect(response.data).toBe('hello world');
    });

    test('returns undefined for an empty response with Content-Length 0', async () => {
        const client = createClient();
        const response = await client.get('/empty').execute();

        expect(response.data).toBeUndefined();
    });

    test('returns ArrayBuffer when responseType is arrayBuffer', async () => {
        const client = createClient();
        const response = await client.get('/binary').asArrayBuffer().execute();

        expect(response.data).toBeInstanceOf(ArrayBuffer);
        expect(Array.from(new Uint8Array(response.data as ArrayBuffer))).toEqual([1, 2, 3, 4]);
    });

    test('returns Blob when responseType is blob', async () => {
        const client = createClient();
        const response = await client.get('/binary').asBlob().execute();

        if (response.data === undefined) {
            throw new Error('Expected Blob response data');
        }

        expect(response.data).toMatchObject({ size: 4, type: 'application/octet-stream' });
    });

    test('returns a readable stream when responseType is stream', async () => {
        const client = createClient();
        const response = await client.get('/stream').asStream().execute();

        if (response.data === undefined) {
            throw new Error('Expected stream response data');
        }

        expect(response.data).toBeInstanceOf(ReadableStream);
        expect(await new Response(response.data).text()).toBe('stream response');
    });

    test('throws ParseError when Fetch stream body is null', async () => {
        if (name !== 'FetchAdapter') {
            return;
        }

        const client = createClient();

        vi.stubGlobal(
            'fetch',
            vi.fn(() =>
                Promise.resolve({
                    ok: true,
                    status: 200,
                    statusText: 'OK',
                    headers: new Headers(),
                    body: null
                } as unknown as Response)
            )
        );

        try {
            await client.get('/stream').asStream().execute();
            expect.fail('Should have thrown');
        } catch (error) {
            expect(error).toBeInstanceOf(ParseError);
            const parseError = error as ParseError;

            expect(parseError.responseType).toBe(HTTP_RESPONSE_TYPES.STREAM);
            expect(parseError.config).toMatchObject({ url: '/stream', baseUrl: BASE_URL });
        } finally {
            vi.unstubAllGlobals();
        }
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

    test('parses error data for a blob response', async () => {
        const client = createClient();

        try {
            await client.get('/not-found').asBlob().execute();
            expect.fail('Should have thrown');
        } catch (error) {
            expect(error).toBeInstanceOf(HttpResponseError);
            expect((error as HttpResponseError).data).toEqual({ error: 'Not found' });
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
            expect(parseError.responseType).toBe('json');
            expect(parseError.raw).toBe('{ invalid json');
        }
    });
});
