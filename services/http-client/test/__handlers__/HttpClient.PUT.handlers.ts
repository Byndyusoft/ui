import { http, HttpResponse } from 'msw';
import { BASE_URL } from '../__fixtures__';

export const handlers = [
    http.put(`${BASE_URL}/items/1`, async ({ request }) => {
        const body = await request.json();
        return HttpResponse.json({ updated: true, ...body });
    })
];
