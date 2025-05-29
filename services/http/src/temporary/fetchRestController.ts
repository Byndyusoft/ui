import HttpRestController from './restController';
import { Headers, Response } from 'happy-dom';
import { ITokenData } from '../types/token.types';

export class HttpRestControllerFetch extends HttpRestController {
    public headers: Headers = new Headers();

    constructor() {
        super();
    }

    setHeader = (key: string, value: string | null): void => {
        if (value) {
            this.headers.append(key, value);
        } else {
            this.headers.delete(key);
        }
    };

    private getCurrentHeaders() {
        const currentHeaders: Record<string, string> = {};
        this.headers.forEach((h, v) => {
            currentHeaders[h] = v;
        });

        return currentHeaders;
    }

    private mergeCurrentHeaders(headers: Headers | undefined) {
        const collectedHeaders: Record<string, string> = this.getCurrentHeaders();

        if (headers) {
            headers.forEach((h, v) => {
                collectedHeaders[h] = v;
            });
        }

        return collectedHeaders;
    }

    get = async <R = Response>(url: string, headers?: Headers): Promise<R> => {
        return fetch(url, { method: 'GET', headers: this.mergeCurrentHeaders(headers) }) as Promise<R>;
    };

    post = async <R = Response>(url: string, body: object, headers?: Headers): Promise<R> => {
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: this.mergeCurrentHeaders(headers)
        }) as Promise<R>;
    };

    patch = async <R = Response>(url: string, body: object, headers?: Headers): Promise<R> => {
        return fetch(url, {
            method: 'PATCH',
            body: JSON.stringify(body),
            headers: this.mergeCurrentHeaders(headers)
        }) as Promise<R>;
    };

    put = async <R = Response>(url: string, body: object, headers?: Headers): Promise<R> => {
        return fetch(url, {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: this.mergeCurrentHeaders(headers)
        }) as Promise<R>;
    };

    delete = async <R = Response>(url: string, body: object = {}, headers?: Headers): Promise<R> => {
        return fetch(url, {
            method: 'DELETE',
            body: JSON.stringify(body),
            headers: this.mergeCurrentHeaders(headers)
        }) as Promise<R>;
    };

    setTokenData(arg: ITokenData): void {}
}
