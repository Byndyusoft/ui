import { http, HttpResponse } from 'msw';

export const getRequest = http.get('https://test-url.com/get', ({ request }) => {
    if (request.headers.get('Authorization') !== 'Bearer token' || request.headers.get('Header') !== 'Header value') {
        return new HttpResponse(null, { status: 400, statusText: 'Wrong headers' });
    }

    return HttpResponse.json({ success: true });
});

export const getRequestWithQuery = http.get('https://test-url.com/get/with-query', ({ request }) => {
    const url = new URL(request.url)

    const testValue  = url.searchParams.get('testKey')

    if (!testValue) {
        return new HttpResponse(null, { status: 404 })
    }

    return HttpResponse.json({ testKey: testValue })
});

export const postRequest = http.post('https://test-url.com/post', async ({ request }) => {
    const requestBody = await request.clone().json();

    if (requestBody && request.headers.get('Authorization') === 'Bearer token' && request.headers.get('Header') === 'Header value') {
        return HttpResponse.json(requestBody);
    }

    return new HttpResponse(null, { status: 400, statusText: 'No body' });
});

export const putRequest = http.put('https://test-url.com/put', async ({ request }) => {
    const url = new URL(request.url)

    const testValue  = url.searchParams.get('testKey')

    if (!testValue) {
        return new HttpResponse(null, { status: 404 })
    }

    const requestBody = await request.clone().json();

    if (requestBody && request.headers.get('Authorization') === 'Bearer token' && request.headers.get('Header') === 'Header value') {
        return HttpResponse.json(requestBody);
    }

    return new HttpResponse(null, { status: 400, statusText: 'No body' });
});

export const patchRequest = http.patch('https://test-url.com/patch', async ({ request }) => {
    const url = new URL(request.url)

    const testValue  = url.searchParams.get('testKey')

    if (!testValue) {
        return new HttpResponse(null, { status: 404 })
    }

    const requestBody = await request.clone().json();

    if (requestBody && request.headers.get('Authorization') === 'Bearer token' && request.headers.get('Header') === 'Header value') {
        return HttpResponse.json(requestBody);
    }

    return new HttpResponse(null, { status: 400, statusText: 'No body' });
});

export const deleteRequest = http.delete('https://test-url.com/delete', async ({ request }) => {
    const url = new URL(request.url)

    const testValue  = url.searchParams.get('testKey');

    if (!testValue) {
        return new HttpResponse(null, { status: 404 });
    }

    if (request.headers.get('Authorization') !== 'Bearer token' || request.headers.get('Header') !== 'Header value') {
        return new HttpResponse(null, { status: 400, statusText: 'Wrong headers' });
    }

    return new HttpResponse(null, { status: 200 });
});
