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

export interface IHttpClientResponse<T = any> {
    data: T;
    status: HttpStatusCode;
    statusText: string;
    headers: THeaders;
    // config?: IRequestConfig<D>;
}

export interface IHttpClientError {}