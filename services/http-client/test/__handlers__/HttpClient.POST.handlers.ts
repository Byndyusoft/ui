import { http, HttpResponse } from 'msw';
import { BASE_URL } from '../__fixtures__';

export const handlers = [
    http.post(`${BASE_URL}/items`, async ({ request }) => {
        const contentType = request.headers.get('content-type');
        const body = (await request.json()) as Record<string, unknown>;
        return HttpResponse.json({ received: body, contentType });
    }),

    http.post(`${BASE_URL}/raw`, async ({ request }) => {
        const contentType = request.headers.get('content-type');
        const body = await request.text();
        return HttpResponse.json({ received: body, contentType });
    }),

    http.post(`${BASE_URL}/form-data`, async ({ request }) => {
        const contentType = request.headers.get('content-type');
        const body = await request.formData();
        return HttpResponse.json({
            name: body.get('name'),
            roles: body.getAll('role'),
            contentType
        });
    }),

    http.post(`${BASE_URL}/url-search-params`, async ({ request }) => {
        const contentType = request.headers.get('content-type');
        const body = new URLSearchParams(await request.text());
        return HttpResponse.json({
            name: body.get('name'),
            roles: body.getAll('role'),
            contentType
        });
    }),

    http.post(`${BASE_URL}/binary`, async ({ request }) => {
        const body = new Uint8Array(await request.arrayBuffer());
        return HttpResponse.json({ received: Array.from(body) });
    }),

    http.post(`${BASE_URL}/echo`, async ({ request }) => {
        const body = (await request.json()) as Record<string, unknown>;
        return HttpResponse.json({ created: true, ...body });
    })
];
