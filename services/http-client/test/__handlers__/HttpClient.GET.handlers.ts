import { http, HttpResponse } from 'msw';
import { BASE_URL } from '../__fixtures__';

export const handlers = [
    http.get(`${BASE_URL}/users/1`, () => {
        return HttpResponse.json({ id: 1, name: 'John' });
    }),

    http.get(`${BASE_URL}/users`, ({ request }) => {
        const url = new URL(request.url);
        return HttpResponse.json({
            page: url.searchParams.get('page'),
            role: url.searchParams.getAll('role'),
            active: url.searchParams.get('active'),
            value: url.searchParams.getAll('value'),
            source: url.searchParams.get('source'),
            keys: [...url.searchParams.keys()]
        });
    }),

    http.get(`${BASE_URL}/api/users`, () => {
        return HttpResponse.json({ scoped: true });
    }),

    http.get(`${BASE_URL}/headers`, ({ request }) => {
        return HttpResponse.json({
            auth: request.headers.get('authorization'),
            custom: request.headers.get('x-custom')
        });
    }),

    http.get(`${BASE_URL}/text`, () => {
        return new HttpResponse('hello world', { headers: { 'Content-Type': 'text/plain' } });
    }),

    http.get(`${BASE_URL}/empty`, () => {
        return new HttpResponse(null, { headers: { 'Content-Length': '0' } });
    }),

    http.get(`${BASE_URL}/binary`, () => {
        const bytes = new Uint8Array([1, 2, 3, 4]);
        return new HttpResponse(bytes.buffer, { headers: { 'Content-Type': 'application/octet-stream' } });
    }),

    http.get(`${BASE_URL}/form-data`, () => {
        return new HttpResponse('name=John&role=admin&role=editor', {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
    }),

    http.get(`${BASE_URL}/stream`, () => {
        return new HttpResponse('stream response', { headers: { 'Content-Type': 'text/plain' } });
    }),

    http.get(`${BASE_URL}/not-found`, () => {
        return HttpResponse.json(
            { error: 'Not found' },
            { status: 404, statusText: 'Not Found', headers: { 'X-Request-Id': 'request-1' } }
        );
    }),

    http.get(`${BASE_URL}/invalid-json`, () => {
        return new HttpResponse('{ invalid json', { headers: { 'Content-Type': 'application/json' } });
    })
];
