import HttpRestController from '../restController';

export class HttpRestControllerFetch extends HttpRestController {
    constructor() {
        super();
        this.headers = new Headers();
    }

    public headers: Headers;

    setHeader = (key: string, value: string | null): void => {
        if (value) {
            this.headers.set(key, value);
        } else {
            this.headers.delete(key);
        }
    };

    get = async <R>(url: string, headers?: Headers): Promise<R> => {
        return fetch(url, { method: 'GET', headers: { ...this.headers, ...headers } }) as Promise<R>;
    };

    post = async <R>(url: string, body: object, headers?: Headers): Promise<R> => {
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                ...this.headers,
                ...headers
            }
        }) as Promise<R>;
    };

    patch = async <R>(url: string, body: object, headers?: Headers): Promise<R> => {
        return fetch(url, {
            method: 'PATCH',
            body: JSON.stringify(body),
            headers: { ...this.headers, ...headers }
        }) as Promise<R>;
    };

    put = async <R>(url: string, body: object, headers?: Headers): Promise<R> => {
        return fetch(url, {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: { ...this.headers, ...headers }
        }) as Promise<R>;
    };

    delete = async <R>(url: string, body: object = {}, headers?: Headers): Promise<R> => {
        return fetch(url, {
            method: 'DELETE',
            body: JSON.stringify(body),
            headers: { ...this.headers, ...headers }
        }) as Promise<R>;
    };
}
