import { setupServer } from 'msw/node';
import * as handlers from '../__handlers__/httpClient.handlers';
import FetchHttpClient from '../services/fetchClient';

import {
    baseUrl,
    baseHeaders,
    optionalHeaders,
    queryParams,
    getPath,
    getPathWithQueryParams,
    postPath,
    putPath,
    patchPath,
    deletePath,
    requestBody,
    successResponse
} from '../__fixtures__/httpClient.fixtures';

const server = setupServer();

describe('services/FetchHttpClient', () => {
    beforeAll(() => {
        server.listen({ onUnhandledRequest: 'error' });
    })

    afterEach(() => {
        server.resetHandlers();
    });

    afterAll(() => {
        server.close();
    });

    test('should send GET request with correct headers, body, and URL', async () => {
        server.use(handlers.getRequest);

        const httpClientInstance = new FetchHttpClient({ baseURL: baseUrl, headers: baseHeaders });

        const response = await httpClientInstance
            .get()
            .url(getPath)
            .headers(optionalHeaders)
            .send();

        expect(response).toEqual(successResponse);
    });

    test('should send GET request with correct query string', async () => {
        server.use(handlers.getRequestWithQuery);

        const httpClientInstance = new FetchHttpClient({ baseURL: baseUrl });

        const response = await httpClientInstance
            .get()
            .url(getPathWithQueryParams)
            .params(queryParams)
            .send();

        expect(response).toEqual(queryParams);
    });

    test('should send POST request with correct headers, body, and URL', async () => {
        server.use(handlers.postRequest);

        const httpClientInstance = new FetchHttpClient({ baseURL: baseUrl, headers: baseHeaders });

        const response = await httpClientInstance
            .post()
            .url(postPath)
            .headers(optionalHeaders)
            .body(requestBody)
            .send();

        expect(response).toEqual(requestBody);
    });

    test('should send PUT request with correct headers, body, URL and query string', async () => {
        server.use(handlers.putRequest);

        const httpClientInstance = new FetchHttpClient({ baseURL: baseUrl, headers: baseHeaders });

        const response = await httpClientInstance
            .put()
            .url(putPath)
            .headers(optionalHeaders)
            .params(queryParams)
            .body(requestBody)
            .send();

        expect(response).toEqual(requestBody);
    });

    test('should send PATCH request with correct headers, body, URL and query string', async () => {
        server.use(handlers.patchRequest);

        const httpClientInstance = new FetchHttpClient({ baseURL: baseUrl, headers: baseHeaders });

        const response = await httpClientInstance
            .patch()
            .url(patchPath)
            .headers(optionalHeaders)
            .params(queryParams)
            .body(requestBody)
            .send();

        expect(response).toEqual(requestBody);
    });

    test('should send DELETE request with correct headers, body, URL and query string', async () => {
        server.use(handlers.deleteRequest);

        const httpClientInstance = new FetchHttpClient({ baseURL: baseUrl, headers: baseHeaders });

        const response = await httpClientInstance
            .delete()
            .url(deletePath)
            .headers(optionalHeaders)
            .params(queryParams)
            .send();

        expect(response).toEqual('');
    });
});
