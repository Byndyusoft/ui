import { THttpMethod } from './HttpMethod';
import { THttpHeaders } from './HttpHeaders';
import { THttpParams } from './HttpParams';
import { THttpResponseType } from './HttpResponseType';

export interface IHttpRequestConfig<TData = unknown> {
    readonly url: string;
    readonly method: THttpMethod;
    readonly baseUrl?: string;
    readonly headers?: THttpHeaders;
    readonly params?: THttpParams;
    readonly data?: TData;
    readonly signal?: AbortSignal;
    readonly timeout?: number;
    readonly responseType?: THttpResponseType;
}
