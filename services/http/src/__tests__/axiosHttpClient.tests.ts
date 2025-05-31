import { setupServer } from 'msw/node';
import * as handlers from '../__handlers__/httpClient.handlers';
import AxiosHttpClient from '../services/axiosClient';

interface IBody {
    bodyKey: string;
}

const requestBody: IBody = {
    bodyKey: 'bodyValue'
}

const baseUrl = 'https://test-url.com';

const baseHeaders = { 'Authorization': 'Bearer token' };

const optionalHeaders = { Header: 'Header value'};

const server = setupServer();

describe('services/AxiosHttpClient', () => {
    beforeAll(() => {
        server.listen({ onUnhandledRequest: 'error' });
    })

    afterEach(() => {
        server.resetHandlers();
    });

    afterAll(() => {
        server.close();
    });

    test('should send POST request with correct headers, body, and URL', async () => {
        server.use(handlers.postRequest);
        const path = '/post';

        const httpClientInstance = new AxiosHttpClient({ baseURL: baseUrl, headers: baseHeaders });

        const response = await httpClientInstance
            .post()
            .url(path)
            .headers(optionalHeaders)
            .body(requestBody)
            .send();

        expect(response).toEqual(requestBody);
    });

    test('should send GET request with correct query string', async () => {
        server.use(handlers.getRequestWithQuery);
        const path = '/get/with-query';
        const queryParams = { testKey: 'testValue' };

        const httpClientInstance = new AxiosHttpClient({ baseURL: baseUrl });

        const response = await httpClientInstance
            .get()
            .url(path)
            .params(queryParams)
            .send();

        expect(response).toEqual(queryParams);
    });
});
