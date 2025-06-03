import { HttpRequest, HttpRequestWithBody, IRequestClientOptions } from './httpRequest';
import { HttpMethod } from '../types/httpMethod.types';
import { IHttpClientResponse, THeaders, TQueryParams } from '../types/httpClient.types';

export const DEFAULT_REQUEST_TIMEOUT = 60000;

export interface IHttpClientInit {
    baseURL: string;
    headers?: THeaders;
    timeout?: number;
}

export abstract class HttpClient {
    abstract requestClient: <R>(arg: IRequestClientOptions) => Promise<IHttpClientResponse<R>>;

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

    get<R = unknown>() {
        return new HttpRequest<R>(this.requestClient, HttpMethod.GET);
    }

    post<R = unknown>() {
        return new HttpRequestWithBody<R>(this.requestClient, HttpMethod.POST);
    }

    put<R = unknown>() {
        return new HttpRequestWithBody<R>(this.requestClient, HttpMethod.PUT);
    }

    patch<R = unknown>() {
        return new HttpRequestWithBody<R>(this.requestClient, HttpMethod.PATCH);
    }

    delete() {
        return new HttpRequest<void>(this.requestClient, HttpMethod.DELETE);
    }
}
