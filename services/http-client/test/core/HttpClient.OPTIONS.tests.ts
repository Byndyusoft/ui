import { setupServer } from 'msw/node';
import { HttpClient } from '../../src/core/HttpClient';
import { FetchAdapter } from '../../src/adapters/FetchAdapter';
import { XhrAdapter } from '../../src/adapters/XhrAdapter';
import { HTTP_STATUS_CODES } from '../../src/constants';
import { IHttpClientAdapter } from '../../src/types';
import { handlers } from '../__handlers__/HttpClient.OPTIONS.handlers';
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

describe.each(adapters)('HttpClient.$name — OPTIONS', ({ create }) => {
    function createClient(): HttpClient {
        return new HttpClient({
            adapter: create(),
            baseUrl: BASE_URL,
            headers: { 'X-Default': 'default-header' }
        });
    }

    test('returns Allow header', async () => {
        const client = createClient();
        const response = await client.options('/items').asText().execute();

        expect(response.status).toBe(HTTP_STATUS_CODES.NO_CONTENT);
        expect(response.headers['allow']).toBe('GET, POST, HEAD, OPTIONS');
    });
});
