import { http, HttpResponse } from 'msw';
import { BASE_URL } from '../__fixtures__';

export const handlers = [
    http.get(`${BASE_URL}/test`, ({ request }) => {
        return HttpResponse.json({
            def: request.headers.get('x-default'),
            custom: request.headers.get('x-custom'),
            authorization: request.headers.get('authorization')
        });
    }),

    http.get(`${BASE_URL}/base-test`, () => {
        return HttpResponse.json({ ok: true });
    }),

    http.get(`${BASE_URL}/server-error`, () => {
        return HttpResponse.json({ error: 'Internal error' }, { status: 500 });
    }),

    http.get(`${BASE_URL}/network-error`, () => {
        return HttpResponse.error();
    })
];
