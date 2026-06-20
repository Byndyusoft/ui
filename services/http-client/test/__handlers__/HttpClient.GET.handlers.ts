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
            role: url.searchParams.getAll('role')
        });
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

    http.get(`${BASE_URL}/not-found`, () => {
        return HttpResponse.json({ error: 'Not found' }, { status: 404 });
    })
];
