import { THttpMethod } from './HttpMethod';
import { THttpHeaders } from './HttpHeaders';
import { THttpParams } from './HttpParams';
import { THttpResponseType } from './HttpResponseType';

export interface IHttpRequestConfig<TData = unknown> {
    url: string;
    method: THttpMethod;
    baseURL?: string;
    headers?: THttpHeaders;
    params?: THttpParams;
    data?: TData;
    signal?: AbortSignal;
    timeout?: number;
    responseType?: THttpResponseType;
}