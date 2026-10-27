import { http, HttpResponse } from 'msw';
import { BASE_URL } from '../__fixtures__';

export const handlers = [
    http.get(`${BASE_URL}/items`, () => {
        return HttpResponse.json({ id: 1, name: 'John' });
    }),

    http.get(`${BASE_URL}/echo-headers`, ({ request }) => {
        return HttpResponse.json({
            authorization: request.headers.get('authorization'),
            custom: request.headers.get('x-custom')
        });
    }),

    http.get(`${BASE_URL}/not-found`, () => {
        return HttpResponse.json({ error: 'Not found' }, { status: 404 });
    }),

    http.get(`${BASE_URL}/network-error`, () => {
        return HttpResponse.error();
    })
];
