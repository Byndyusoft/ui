import { IHttpClientAdapter } from './HttpClientAdapter';
import { THttpHeaders } from './HttpHeaders';
import { THttpRequestErrorHook, THttpRequestHook, THttpResponseErrorHook, THttpResponseHook } from './HttpHooks';

export interface IHttpClientOptions {
    adapter: IHttpClientAdapter;
    baseUrl?: string;
    headers?: THttpHeaders;
    timeout?: number;
    onRequest?: THttpRequestHook;
    onRequestError?: THttpRequestErrorHook;
    onResponse?: THttpResponseHook;
    onResponseError?: THttpResponseErrorHook;
}
