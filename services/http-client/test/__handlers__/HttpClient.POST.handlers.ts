import { http, HttpResponse } from 'msw';
import { BASE_URL } from '../__fixtures__';

export const handlers = [
    http.post(`${BASE_URL}/items`, async ({ request }) => {
        const contentType = request.headers.get('content-type');
        const body = await request.json();
        return HttpResponse.json({ received: body, contentType });
    }),

    http.post(`${BASE_URL}/raw`, async ({ request }) => {
        const contentType = request.headers.get('content-type');
        const body = await request.text();
        return HttpResponse.json({ received: body, contentType });
    }),

    http.post(`${BASE_URL}/echo`, async ({ request }) => {
        const body = await request.json();
        return HttpResponse.json({ created: true, ...body });
    })
];
