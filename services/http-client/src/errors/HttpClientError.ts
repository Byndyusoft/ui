import { IHttpRequestConfig } from '../types';

export interface IHttpClientErrorOptions extends ErrorOptions {
    config?: IHttpRequestConfig;
}

/** Базовый класс всех ошибок http-клиента. Позволяет поймать любую ошибку клиента одной проверкой instanceof. */
export class HttpClientError extends Error {
    public readonly config?: IHttpRequestConfig;

    constructor(message: string, options?: IHttpClientErrorOptions) {
        super(message, options);
        this.name = this.constructor.name;
        this.config = options?.config;

        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export function isHttpClientError(error: unknown): error is HttpClientError {
    return error instanceof HttpClientError;
}
