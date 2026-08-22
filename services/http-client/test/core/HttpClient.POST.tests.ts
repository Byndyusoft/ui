import { setupServer } from 'msw/node';
import { Blob as NodeBlob } from 'node:buffer';
import { HttpClient } from '../../src/core/HttpClient';
import { FetchAdapter } from '../../src/adapters/FetchAdapter';
import { XhrAdapter } from '../../src/adapters/XhrAdapter';
import { IHttpClientAdapter } from '../../src/types';
import { handlers } from '../__handlers__/HttpClient.POST.handlers';
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

describe.each(adapters)('HttpClient.$name — POST', ({ create }) => {
    function createClient(): HttpClient {
        return new HttpClient({
            adapter: create(),
            baseUrl: BASE_URL,
            headers: { 'X-Default': 'default-header' }
        });
    }

    test('sends JSON body with auto Content-Type', async () => {
        const client = createClient();
        const response = await client
            .post('/items')
            .body({ name: 'New item' })
            .execute<{ received: { name: string }; contentType: string | null }>();

        expect(response.data?.received).toEqual({ name: 'New item' });
        expect(response.data?.contentType).toBe('application/json');
    });

    test('sends string body without overriding Content-Type', async () => {
        const client = createClient();
        const response = await client
            .post('/raw')
            .body('plain text body')
            .header('Content-Type', 'text/plain')
            .execute<{ received: string; contentType: string | null }>();

        expect(response.data?.received).toBe('plain text body');
        expect(response.data?.contentType).toBe('text/plain');
    });

    test('sends null as an explicit JSON body', async () => {
        const client = createClient();
        const response = await client
            .post('/raw')
            .body(null)
            .execute<{ received: string; contentType: string | null }>();

        expect(response.data).toEqual({ received: 'null', contentType: 'application/json' });
    });

    test('sends FormData without JSON serialization', async () => {
        const client = createClient();
        const formData = new FormData();
        formData.append('name', 'Jane');
        formData.append('role', 'admin');
        formData.append('role', 'editor');

        const response = await client
            .post('/form-data')
            .body(formData)
            .execute<{ name: string; roles: string[]; contentType: string | null }>();

        expect(response.data?.name).toBe('Jane');
        expect(response.data?.roles).toEqual(['admin', 'editor']);
        expect(response.data?.contentType).toMatch(/^multipart\/form-data; boundary=/);
    });

    test('sends URLSearchParams with form URL encoded Content-Type', async () => {
        const client = createClient();
        const params = new URLSearchParams();
        params.append('name', 'Jane');
        params.append('role', 'admin');
        params.append('role', 'editor');

        const response = await client
            .post('/url-search-params')
            .body(params)
            .execute<{ name: string; roles: string[]; contentType: string | null }>();

        expect(response.data).toEqual({
            name: 'Jane',
            roles: ['admin', 'editor'],
            contentType: 'application/x-www-form-urlencoded;charset=UTF-8'
        });
    });

    test('sends Blob body without JSON serialization', async () => {
        const client = createClient();
        const response = await client
            .post('/binary')
            .body(new NodeBlob([new Uint8Array([0, 1, 255])]))
            .execute<{ received: number[] }>();

        expect(response.data?.received).toEqual([0, 1, 255]);
    });

    test('sends typed array body without JSON serialization', async () => {
        const client = createClient();
        const response = await client
            .post('/binary')
            .body(new Uint8Array([0, 1, 255]))
            .execute<{ received: number[] }>();

        expect(response.data?.received).toEqual([0, 1, 255]);
    });

    test('does not add a duplicate Content-Type when it uses different casing', async () => {
        const client = new HttpClient({
            adapter: create(),
            baseUrl: BASE_URL,
            headers: { 'content-type': 'application/vnd.api+json' }
        });
        const response = await client
            .post('/items')
            .body({ name: 'New item' })
            .execute<{ contentType: string | null }>();

        expect(response.data?.contentType).toBe('application/vnd.api+json');
    });

    test('echoes body back', async () => {
        const client = createClient();
        const response = await client
            .post('/echo')
            .body({ name: 'Jane' })
            .execute<{ created: boolean; name: string }>();

        expect(response.data).toEqual({ created: true, name: 'Jane' });
    });
});
