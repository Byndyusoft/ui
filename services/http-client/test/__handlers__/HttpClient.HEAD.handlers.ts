import { http, HttpResponse } from 'msw';
import { BASE_URL } from '../__fixtures__';

export const handlers = [
    http.head(`${BASE_URL}/items`, () => {
        return new HttpResponse(null, { status: 200, headers: { 'X-Total': '42' } });
    })
];
