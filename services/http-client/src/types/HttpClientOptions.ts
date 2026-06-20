import { IHttpClientAdapter } from './HttpClientAdapter';
import { THttpHeaders } from './HttpHeaders';

export interface IHttpClientOptions {
    adapter: IHttpClientAdapter;
    baseURL?: string;
    headers?: THttpHeaders;
    timeout?: number;
}