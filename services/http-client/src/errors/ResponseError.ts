import { IHttpRequestConfig, THttpHeaders, THttpStatusCode } from '../types';

export class ResponseError<T = unknown> extends Error {
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
        this.name = this.constructor.name;

        this.statusCode = statusCode;
        this.statusText = statusText;
        this.headers = headers;
        this.config = config;
        this.data = data;

        Object.setPrototypeOf(this, new.target.prototype);
    }
}
