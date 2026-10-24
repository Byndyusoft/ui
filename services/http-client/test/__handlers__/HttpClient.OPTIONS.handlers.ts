import { http, HttpResponse } from 'msw';
import { BASE_URL } from '../__fixtures__';

export const handlers = [
    http.options(`${BASE_URL}/items`, () => {
        return new HttpResponse(null, {
            status: 204,
            headers: { Allow: 'GET, POST, HEAD, OPTIONS' }
        });
    })
];
