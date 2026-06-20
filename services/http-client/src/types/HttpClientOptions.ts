import { IHttpClientAdapter } from './HttpClientAdapter';
import { THttpHeaders } from './HttpHeaders';

export interface IHttpClientOptions {
    adapter: IHttpClientAdapter;
    baseUrl?: string;
    headers?: THttpHeaders;
    timeout?: number;
}
