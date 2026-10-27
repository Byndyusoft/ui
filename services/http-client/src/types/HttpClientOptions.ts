import { IHttpClientAdapter } from './HttpClientAdapter';
import { THttpHeaders } from './HttpHeaders';
import { THttpRequestErrorHook, THttpRequestHook, THttpResponseErrorHook, THttpResponseHook } from './HttpHooks';
import { THttpParams } from './HttpParams';
import { TValidateStatus } from './ValidateStatus';

export interface IHttpClientOptions {
    /** Uses FetchAdapter when omitted. */
    adapter?: IHttpClientAdapter;
    baseUrl?: string;
    headers?: THttpHeaders;
    params?: THttpParams;
    timeout?: number;
    /** Determines whether a response status should be treated as successful. */
    validateStatus?: TValidateStatus;
    /** Sends cookies and HTTP credentials with cross-origin requests. */
    withCredentials?: boolean;
    onRequest?: THttpRequestHook;
    onRequestError?: THttpRequestErrorHook;
    onResponse?: THttpResponseHook;
    onResponseError?: THttpResponseErrorHook;
}
