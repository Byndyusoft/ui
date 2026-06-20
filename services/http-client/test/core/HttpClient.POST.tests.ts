import { setupServer } from 'msw/node';
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

        expect(response.data.received).toEqual({ name: 'New item' });
        expect(response.data.contentType).toBe('application/json');
    });

    test('sends string body without overriding Content-Type', async () => {
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
        const client = createClient();
        const response = await client
            .post('/echo')
            .body({ name: 'Jane' })
            .execute<{ created: boolean; name: string }>();

        expect(response.data).toEqual({ created: true, name: 'Jane' });
    });
});