import { THttpStatusCode } from '../types';

export class HttpError extends Error {
    public readonly statusCode?: THttpStatusCode;
    public readonly data?: unknown;

    constructor(message: string, statusCode?: THttpStatusCode, data?: unknown) {
        super(message);
        this.name = this.constructor.name;

        this.statusCode = statusCode;
        this.data = data;

        Object.setPrototypeOf(this, new.target.prototype);
    }
}
