import { http, HttpResponse, delay } from 'msw';
import {
    baseUrl,
    getPath,
    postPath,
    putPath,
    patchPath,
    deletePath,
    getPathWithQueryParams,
    getPathWithError,
    getPathWithTimeout,
    getTokenPath,
    getDataWithAuthorizationPath,
    queryParams,
    errorDetails,
    successResponse
} from '../__fixtures__/httpClient.fixtures';
import { HttpStatusCode } from '../types/httpStatusCode.types';

export const getRequest = http.get(`${baseUrl}${getPath}`, ({ request }) => {
    if (request.headers.get('Authorization') !== 'Bearer token' || request.headers.get('Header') !== 'Header value') {
        return new HttpResponse(null, { status: HttpStatusCode.BAD_REQUEST, statusText: 'Wrong headers' });
    }

    return HttpResponse.json({ success: true });
});

export const getRequestWithQuery = http.get(`${baseUrl}${getPathWithQueryParams}`, ({ request }) => {
    const url = new URL(request.url);

    const testParamValue  = url.searchParams.get('testParam');

    if (!testParamValue) {
        return new HttpResponse(null, { status: HttpStatusCode.NOT_FOUND });
    }

    return HttpResponse.json({ testParam: testParamValue });
});

export const getRequestWithError = http.get(`${baseUrl}${getPathWithError}`, ({ request }) => {
    const url = new URL(request.url);

    const testParamValue  = url.searchParams.get('testParam');

    if (testParamValue === queryParams['testParam']) {
        return new HttpResponse(JSON.stringify(errorDetails), { status: HttpStatusCode.BAD_REQUEST, headers: { 'content-type': 'application/json' } });
    }

    return HttpResponse.json(successResponse);
});

export const getRequestWithTimeout = http.get(`${baseUrl}${getPathWithTimeout}`, async () => {
    await delay(3000);

    return HttpResponse.json(successResponse);
});

export const getToken = http.get(`${baseUrl}${getTokenPath}`, () => HttpResponse.json({ token: 'test_token_01' }));

export const getDataWithAuthorization = http.get(`${baseUrl}${getDataWithAuthorizationPath}`, async ({ request }) => {
    await delay(1000);

    if (request.headers.get('Authorization') !== 'Bearer test_token_01') {
        return new HttpResponse(null, { status: HttpStatusCode.UNAUTHORIZED, statusText: 'Unauthorized' });
    }

    return HttpResponse.json(successResponse);
});

export const postRequest = http.post(`${baseUrl}${postPath}`, async ({ request }) => {
    const requestBody = await request.clone().json();

    if (requestBody && request.headers.get('Authorization') === 'Bearer token' && request.headers.get('Header') === 'Header value') {
        return HttpResponse.json(requestBody);
    }

    return new HttpResponse(null, { status: HttpStatusCode.BAD_REQUEST, statusText: 'No body' });
});

export const putRequest = http.put(`${baseUrl}${putPath}`, async ({ request }) => {
    const url = new URL(request.url)

    const testParamValue  = url.searchParams.get('testParam')

    if (!testParamValue) {
        return new HttpResponse(null, { status: HttpStatusCode.NOT_FOUND })
    }

    const requestBody = await request.clone().json();

    if (requestBody && request.headers.get('Authorization') === 'Bearer token' && request.headers.get('Header') === 'Header value') {
        return HttpResponse.json(requestBody);
    }

    return new HttpResponse(null, { status: HttpStatusCode.BAD_REQUEST, statusText: 'No body' });
});

export const patchRequest = http.patch(`${baseUrl}${patchPath}`, async ({ request }) => {
    const url = new URL(request.url)

    const testParamValue  = url.searchParams.get('testParam')

    if (!testParamValue) {
        return new HttpResponse(null, { status: HttpStatusCode.NOT_FOUND })
    }

    const requestBody = await request.clone().json();

    if (requestBody && request.headers.get('Authorization') === 'Bearer token' && request.headers.get('Header') === 'Header value') {
        return HttpResponse.json(requestBody);
    }

    return new HttpResponse(null, { status: HttpStatusCode.BAD_REQUEST, statusText: 'No body' });
});

export const deleteRequest = http.delete(`${baseUrl}${deletePath}`, async ({ request }) => {
    const url = new URL(request.url)

    const testParamValue  = url.searchParams.get('testParam');

    if (!testParamValue) {
        return new HttpResponse(null, { status: HttpStatusCode.NOT_FOUND });
    }

    if (request.headers.get('Authorization') !== 'Bearer token' || request.headers.get('Header') !== 'Header value') {
        return new HttpResponse(null, { status: HttpStatusCode.BAD_REQUEST, statusText: 'Wrong headers' });
    }

    return new HttpResponse(null, { status: HttpStatusCode.OK });
});
