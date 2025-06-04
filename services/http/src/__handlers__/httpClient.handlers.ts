import { http, HttpResponse } from 'msw';
import {
    baseUrl,
    getPath,
    postPath,
    putPath,
    patchPath,
    deletePath,
    getPathWithQueryParams,
    getPathWithError,
    queryParams,
    errorDetails
} from '../__fixtures__/httpClient.fixtures';

export const getRequest = http.get(`${baseUrl}${getPath}`, ({ request }) => {
    if (request.headers.get('Authorization') !== 'Bearer token' || request.headers.get('Header') !== 'Header value') {
        return new HttpResponse(null, { status: 400, statusText: 'Wrong headers' });
    }

    return HttpResponse.json({ success: true });
});

export const getRequestWithQuery = http.get(`${baseUrl}${getPathWithQueryParams}`, ({ request }) => {
    const url = new URL(request.url);

    const testParamValue  = url.searchParams.get('testParam');

    if (!testParamValue) {
        return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json({ testParam: testParamValue });
});

export const getRequestWithError = http.get(`${baseUrl}${getPathWithError}`, ({ request }) => {
    const url = new URL(request.url);

    const testParamValue  = url.searchParams.get('testParam');

    if (testParamValue === queryParams['testParam']) {
        return new HttpResponse(JSON.stringify(errorDetails), { status: 400, headers: { 'content-type': 'application/json' } });
    }

    return HttpResponse.json({ testParam: testParamValue });
});

export const postRequest = http.post(`${baseUrl}${postPath}`, async ({ request }) => {
    const requestBody = await request.clone().json();

    if (requestBody && request.headers.get('Authorization') === 'Bearer token' && request.headers.get('Header') === 'Header value') {
        return HttpResponse.json(requestBody);
    }

    return new HttpResponse(null, { status: 400, statusText: 'No body' });
});

export const putRequest = http.put(`${baseUrl}${putPath}`, async ({ request }) => {
    const url = new URL(request.url)

    const testParamValue  = url.searchParams.get('testParam')

    if (!testParamValue) {
        return new HttpResponse(null, { status: 404 })
    }

    const requestBody = await request.clone().json();

    if (requestBody && request.headers.get('Authorization') === 'Bearer token' && request.headers.get('Header') === 'Header value') {
        return HttpResponse.json(requestBody);
    }

    return new HttpResponse(null, { status: 400, statusText: 'No body' });
});

export const patchRequest = http.patch(`${baseUrl}${patchPath}`, async ({ request }) => {
    const url = new URL(request.url)

    const testParamValue  = url.searchParams.get('testParam')

    if (!testParamValue) {
        return new HttpResponse(null, { status: 404 })
    }

    const requestBody = await request.clone().json();

    if (requestBody && request.headers.get('Authorization') === 'Bearer token' && request.headers.get('Header') === 'Header value') {
        return HttpResponse.json(requestBody);
    }

    return new HttpResponse(null, { status: 400, statusText: 'No body' });
});

export const deleteRequest = http.delete(`${baseUrl}${deletePath}`, async ({ request }) => {
    const url = new URL(request.url)

    const testParamValue  = url.searchParams.get('testParam');

    if (!testParamValue) {
        return new HttpResponse(null, { status: 404 });
    }

    if (request.headers.get('Authorization') !== 'Bearer token' || request.headers.get('Header') !== 'Header value') {
        return new HttpResponse(null, { status: 400, statusText: 'Wrong headers' });
    }

    return new HttpResponse(null, { status: 200 });
});
