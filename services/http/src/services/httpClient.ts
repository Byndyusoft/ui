import { HttpRequest, HttpRequestWithBody, IRequestOptions } from './httpRequest';
import { HttpMethod } from '../types/httpMethod.types';
import {
    IHttpClientResponse,
    HttpClientError,
    THeaders,
    TQueryParams,
    IRequestConfig
} from '../types/httpClient.types';

export const DEFAULT_REQUEST_TIMEOUT = 60000;

export interface IHttpClientInit {
    baseURL?: string;
    headers?: THeaders;
    timeout?: number;
}

type TRequestInterceptor = (request: IRequestConfig) => Promise<IRequestConfig>;
type TResponseInterceptor = (response: IHttpClientResponse, error?: HttpClientError) => Promise<IHttpClientResponse>;

export abstract class HttpClient {
    baseURL: string;
    headers: THeaders;
    timeout: number;
    protected requestInterceptor?: TRequestInterceptor;
    protected responseInterceptor?: TResponseInterceptor;

    protected constructor({ baseURL, headers, timeout }: IHttpClientInit) {
        this.baseURL = baseURL ?? '';
        this.headers = headers ?? {};
        this.timeout = timeout ?? DEFAULT_REQUEST_TIMEOUT;
    }

    abstract requestClient: <R>(arg: IRequestOptions) => Promise<IHttpClientResponse<R>>;

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

    setHeader(key: string, value: string): void {
        this.headers[key] = value;
    };

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

    addRequestInterceptor(interceptor: TRequestInterceptor): void {
        this.requestInterceptor = interceptor;
    }

    addResponseInterceptor(interceptor: TResponseInterceptor): void {
        this.responseInterceptor = interceptor;
    }

    protected async processRequest(config: IRequestConfig): Promise<IRequestConfig> {
        if (this.requestInterceptor) {
            return this.requestInterceptor(config);
        }

        return config;
    }
}
