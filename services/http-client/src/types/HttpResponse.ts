import { THttpStatusCode } from './HttpStatusCode';
import { THttpHeaders } from './HttpHeaders';
import { IHttpRequestConfig } from './HttpRequestConfig';

export interface IHttpResponse<T = unknown> {
    data: T;
    status: THttpStatusCode;
    statusText: string;
    headers: THttpHeaders;
    config: IHttpRequestConfig;
}