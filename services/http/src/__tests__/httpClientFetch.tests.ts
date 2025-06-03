import { setupServer } from 'msw/node';
import * as handlers from '../__handlers__/httpClient.handlers';
import HttpClientFetch from '../services/httpClientFetch';

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
import { HttpStatusCode } from '../types/httpStatusCode.types';

const server = setupServer();

describe('services/HttpClientFetch', () => {
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

        const httpClientInstance = new HttpClientFetch({ baseURL: baseUrl, headers: baseHeaders });

        const response = await httpClientInstance
            .get()
            .url(getPath)
            .headers(optionalHeaders)
            .send();

        expect(response.data).toEqual(successResponse);
    });

    test('should send GET request with correct query string', async () => {
        server.use(handlers.getRequestWithQuery);

        const httpClientInstance = new HttpClientFetch({ baseURL: baseUrl });

        const response = await httpClientInstance
            .get()
            .url(getPathWithQueryParams)
            .params(queryParams)
            .send();

        expect(response.data).toEqual(queryParams);
    });

    test('should send POST request with correct headers, body, and URL', async () => {
        server.use(handlers.postRequest);

        const httpClientInstance = new HttpClientFetch({ baseURL: baseUrl, headers: baseHeaders });

        const response = await httpClientInstance
            .post()
            .url(postPath)
            .headers(optionalHeaders)
            .body(requestBody)
            .send();

        expect(response.data).toEqual(requestBody);
    });

    test('should send PUT request with correct headers, body, URL and query string', async () => {
        server.use(handlers.putRequest);

        const httpClientInstance = new HttpClientFetch({ baseURL: baseUrl, headers: baseHeaders });

        const response = await httpClientInstance
            .put()
            .url(putPath)
            .headers(optionalHeaders)
            .params(queryParams)
            .body(requestBody)
            .send();

        expect(response.data).toEqual(requestBody);
    });

    test('should send PATCH request with correct headers, body, URL and query string', async () => {
        server.use(handlers.patchRequest);

        const httpClientInstance = new HttpClientFetch({ baseURL: baseUrl, headers: baseHeaders });

        const response = await httpClientInstance
            .patch()
            .url(patchPath)
            .headers(optionalHeaders)
            .params(queryParams)
            .body(requestBody)
            .send();

        expect(response.data).toEqual(requestBody);
    });

    test('should send DELETE request with correct headers, body, URL and query string', async () => {
        server.use(handlers.deleteRequest);

        const httpClientInstance = new HttpClientFetch({ baseURL: baseUrl, headers: baseHeaders });

        const response = await httpClientInstance
            .delete()
            .url(deletePath)
            .headers(optionalHeaders)
            .params(queryParams)
            .send();

        expect(response.status).toEqual(HttpStatusCode.OK);
    });
});
