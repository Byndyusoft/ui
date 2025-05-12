import HttpRestController from '../restController';

export class HttpRestControllerFetch extends HttpRestController {
    constructor() {
        super();
        this.headers = new Headers();
    }

    public headers: Headers;

    async get<R>(url: string, headers?: Headers): Promise<R> {
        return fetch(url, { method: 'GET', headers: { ...this.headers, ...headers } }) as Promise<R>;
    }

    async post<R>(url: string, body: object, headers?: Headers): Promise<R> {
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                ...this.headers,
                ...headers
            }
        }) as Promise<R>;
    }

    async put<R>(url: string, body: object, headers?: Headers): Promise<R> {
        return fetch(url, {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: { ...this.headers, ...headers }
        }) as Promise<R>;
    }

    async patch<R>(url: string, body: object, headers?: Headers): Promise<R> {
        return fetch(url, {
            method: 'PATCH',
            body: JSON.stringify(body),
            headers: { ...this.headers, ...headers }
        }) as Promise<R>;
    }

    async delete<R>(url: string, body: object = {}, headers?: Headers): Promise<R> {
        return fetch(url, {
            method: 'DELETE',
            body: JSON.stringify(body),
            headers: { ...this.headers, ...headers }
        }) as Promise<R>;
    }
}
