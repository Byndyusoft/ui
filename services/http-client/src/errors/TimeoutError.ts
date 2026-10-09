import { HttpClientError, IHttpClientErrorOptions } from './HttpClientError';

export interface ITimeoutErrorOptions extends IHttpClientErrorOptions {
    timeout?: number;
}

/** Indicates that the request exceeded the configured timeout. */
export class TimeoutError extends HttpClientError {
    public readonly timeout?: number;

    constructor(message: string, options?: ITimeoutErrorOptions) {
        super(message, options);

        this.timeout = options?.timeout;
    }
}

export function isTimeoutError(error: unknown): error is TimeoutError {
    return error instanceof TimeoutError;
}
