import { http, HttpResponse } from 'msw';
import { BASE_URL } from '../__fixtures__';

export const handlers = [
    http.delete(`${BASE_URL}/items/1`, () => {
        return new HttpResponse(null, { status: 204 });
    })
];
