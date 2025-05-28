import { HttpRequest, HttpRequestWithBody, IRequestClientOptions, IHeaders, TQueryParams } from './httpRequest';
import { HttpMethod } from './httpMethod.types';

export const DEFAULT_REQUEST_TIMEOUT = 60000;

export interface IHttpClientInit {
    baseURL: string;
    headers?: IHeaders;
    timeout?: number;
}

export interface IHttpClient {
    requestClient<R>(arg: IRequestClientOptions): Promise<R>;
    setHeader(key: string, value: string): void;
    get<R>(): HttpRequest<R>;
    post<R>(): HttpRequestWithBody<R>;
    put<R>(): HttpRequestWithBody<R>;
    patch<R>(): HttpRequestWithBody<R>;
    delete(): HttpRequest<void>;
}

export abstract class HttpClient {
    abstract requestClient<R>(arg: IRequestClientOptions): Promise<R>;

    abstract setHeader(key: string, value: string): void;

    static buildQueryString(queryParams: TQueryParams) {
        const params = Object.keys(queryParams);
        if (params.length > 0) {
            return `?${
                params
                    .map(param => `${encodeURIComponent(param)}=${encodeURIComponent(queryParams[param])}`)
                    .join('&')
            }`;
        }
        return '';
    }

    get<R>() {
        return new HttpRequest<R>(this.requestClient, HttpMethod.GET);
    }

    post<R>() {
        return new HttpRequestWithBody<R>(this.requestClient, HttpMethod.POST);
    }

    put<R>() {
        return new HttpRequestWithBody<R>(this.requestClient, HttpMethod.PUT);
    }

    patch<R>() {
        return new HttpRequestWithBody<R>(this.requestClient, HttpMethod.PATCH);
    }

    delete() {
        return new HttpRequest<void>(this.requestClient, HttpMethod.DELETE);
    }
}
