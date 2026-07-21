import { IHttpRequestConfig, THttpHeaders, THttpStatusCode } from '../types';
import { HttpClientError } from './HttpClientError';

export class ResponseError<T = unknown> extends HttpClientError {
    public readonly statusCode: THttpStatusCode;
    public readonly statusText: string;
    public readonly headers: THttpHeaders;
    public readonly config: IHttpRequestConfig;
    public readonly data: T | undefined;

    constructor(
        message: string,
        statusCode: THttpStatusCode,
        statusText: string,
        headers: THttpHeaders,
        config: IHttpRequestConfig,
        data?: T
    ) {
        super(message);

        this.statusCode = statusCode;
        this.statusText = statusText;
        this.headers = headers;
        this.config = config;
        this.data = data;
    }
}
