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
    const newPost = await request.clone().json();

    if (newPost && request.headers.get('Authorization') === 'Bearer token' && request.headers.get('Header') === 'Header value') {
        return HttpResponse.json(newPost);
    }

    return new HttpResponse(null, { status: 400, statusText: 'No body' });
});
