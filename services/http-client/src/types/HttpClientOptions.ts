import { IHttpClientAdapter } from './HttpClientAdapter';
import { THttpHeaders } from './HttpHeaders';
import { THttpRequestErrorHook, THttpRequestHook, THttpResponseErrorHook, THttpResponseHook } from './HttpHooks';
import { THttpParams } from './HttpParams';

export interface IHttpClientOptions {
    /** Uses FetchAdapter when omitted. */
    adapter?: IHttpClientAdapter;
    baseUrl?: string;
    headers?: THttpHeaders;
    params?: THttpParams;
    timeout?: number;
    onRequest?: THttpRequestHook;
    onRequestError?: THttpRequestErrorHook;
    onResponse?: THttpResponseHook;
    onResponseError?: THttpResponseErrorHook;
}
