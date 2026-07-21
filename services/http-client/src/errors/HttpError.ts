import { THttpStatusCode } from '../types';
import { HttpClientError } from './HttpClientError';

export class HttpError extends HttpClientError {
    public readonly statusCode?: THttpStatusCode;
    public readonly data?: unknown;

    constructor(message: string, statusCode?: THttpStatusCode, data?: unknown) {
        super(message);

        this.statusCode = statusCode;
        this.data = data;
    }
}
