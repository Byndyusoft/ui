import { http, HttpResponse } from 'msw';
import { BASE_URL } from '../__fixtures__';

export const handlers = [
    http.patch(`${BASE_URL}/items/1`, async ({ request }) => {
        const body = (await request.json()) as Record<string, unknown>;
        return HttpResponse.json({ patched: true, ...body });
    })
];
