import { HttpStatusCode } from './httpStatusCode.types';

export type THeaders = Record<string, string>;

export type TQueryParamValue = string | number | boolean;

export type TQueryParams = Record<string, TQueryParamValue>;

export interface IRequestConfig<D> {
    url?: string;
    method?: string;
    baseURL?: string;
    headers?: THeaders;
    params?: TQueryParams;
    data?: D;
}

export interface IHttpClientResponse<T = unknown> {
    data: T;
    status: HttpStatusCode;
    statusText: string;
    headers: THeaders;
    // config?: IRequestConfig<D>;
}

export class HttpClientError<T = unknown> extends Error {
    code?: string;
    response?: IHttpClientResponse<T>;
    // config?: IRequestConfig<D>

    constructor(args: {
        message?: string;
        code?: string;
        response?: IHttpClientResponse<T>;
        // config?: IRequestConfig<D>;
    }) {
        super(args.message);
        this.code = args.code;
        this.response = args.response;
    };
}
