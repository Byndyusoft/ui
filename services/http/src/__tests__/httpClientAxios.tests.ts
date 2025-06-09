import { setupServer } from 'msw/node';
import * as handlers from '../__handlers__/httpClient.handlers';
import HttpClientAxios from '../services/httpClientAxios';
import {
    baseUrl,
    baseHeaders,
    optionalHeaders,
    queryParams,
    getPath,
    getPathWithQueryParams,
    getPathWithTimeout,
    postPath,
    putPath,
    patchPath,
    deletePath,
    requestBody,
    successResponse,
    getPathWithError,
    errorDetails
} from '../__fixtures__/httpClient.fixtures';
import { HttpStatusCode } from '../types/httpStatusCode.types';
import { HttpClientError } from '../types/httpClient.types';

const server = setupServer();

describe('services/HttpClientAxios', () => {
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

        const httpClientInstance = new HttpClientAxios({ baseURL: baseUrl, headers: baseHeaders });

        const response = await httpClientInstance
            .get()
            .url(getPath)
            .headers(optionalHeaders)
            .send();

        expect(response.data).toEqual(successResponse);
    });

    test('should send GET request with correct query string', async () => {
        server.use(handlers.getRequestWithQuery);

        const httpClientInstance = new HttpClientAxios({ baseURL: baseUrl });

        const response = await httpClientInstance
            .get()
            .url(getPathWithQueryParams)
            .params(queryParams)
            .send();

        expect(response.data).toEqual(queryParams);
    });

    test('should get correct 400 error on GET request', async () => {
        server.use(handlers.getRequestWithError);

        const httpClientInstance = new HttpClientAxios({ baseURL: baseUrl });

        try {
            const response = await httpClientInstance
                .get()
                .url(getPathWithError)
                .params(queryParams)
                .send();

            expect(response).rejects.toThrowError();
        } catch (error) {
            const clientError = error as HttpClientError;

            expect(clientError.code).toBe('ERR_BAD_REQUEST');
            expect(clientError.response?.status).toBe(HttpStatusCode.BAD_REQUEST);
            expect(clientError.response?.data).toEqual(errorDetails);
        }
    });

    test('should get the error when GET request timeout exceeded', async () => {
        server.use(handlers.getRequestWithTimeout);

        const httpClientInstance = new HttpClientAxios({ baseURL: baseUrl, timeout: 1000 });

        const response = httpClientInstance
            .get()
            .url(getPathWithTimeout)
            .send();

        await expect(response).rejects.toThrow(); // Error('Timeout of 1000ms exceeded');
    });

    test('should get the error on request cancel', async () => {
        server.use(handlers.getRequestWithTimeout);

        const httpClientInstance = new HttpClientAxios({ baseURL: baseUrl });

        const controller = new AbortController();

        const response = httpClientInstance
            .get()
            .url(getPathWithTimeout)
            .signal(controller.signal)
            .send();

        controller.abort();

        await expect(response).rejects.toThrowError('The request was cancelled');
    });

    test('should send POST request with correct headers, body, and URL', async () => {
        server.use(handlers.postRequest);

        const httpClientInstance = new HttpClientAxios({ baseURL: baseUrl, headers: baseHeaders });

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

        const httpClientInstance = new HttpClientAxios({ baseURL: baseUrl, headers: baseHeaders });

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

        const httpClientInstance = new HttpClientAxios({ baseURL: baseUrl, headers: baseHeaders });

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

        const httpClientInstance = new HttpClientAxios({ baseURL: baseUrl, headers: baseHeaders });

        const response = await httpClientInstance
            .delete()
            .url(deletePath)
            .headers(optionalHeaders)
            .params(queryParams)
            .send();

        expect(response.status).toEqual(HttpStatusCode.OK);
    });
});
