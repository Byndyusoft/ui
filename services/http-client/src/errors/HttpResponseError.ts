import { IHttpRequestConfig, THttpHeaders, THttpStatusCode } from '../types';
import { HttpClientError } from './HttpClientError';

/** Indicates that the server completed the request with a non-2xx status. */
export class HttpResponseError<T = unknown> extends HttpClientError {
    public readonly status: THttpStatusCode;
    public readonly statusText: string;
    public readonly headers: THttpHeaders;
    public readonly config: IHttpRequestConfig;
    public readonly data: T | undefined;

    constructor(
        message: string,
        status: THttpStatusCode,
        statusText: string,
        headers: THttpHeaders,
        config: IHttpRequestConfig,
        data?: T,
        options?: ErrorOptions
    ) {
        super(message, options);

        this.status = status;
        this.statusText = statusText;
        this.headers = headers;
        this.config = config;
        this.data = data;
    }
}
