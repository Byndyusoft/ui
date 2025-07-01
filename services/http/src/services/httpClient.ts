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
type TResponseInterceptor<R = any> = (response: IHttpClientResponse<R>) => Promise<IHttpClientResponse<R>>;
type TErrorInterceptor<R = any> = (error: HttpClientError) => Promise<never | IHttpClientResponse<R>>;

export abstract class HttpClient {
    baseURL: string;
    headers: THeaders;
    timeout: number;
    protected requestInterceptor?: TRequestInterceptor;
    protected responseInterceptor?: TResponseInterceptor;
    protected errorInterceptor?: TErrorInterceptor;

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

    setRequestInterceptor(interceptor: TRequestInterceptor): void {
        this.requestInterceptor = interceptor;
    }

    setResponseInterceptor<R>(interceptor: TResponseInterceptor<R>): void {
        this.responseInterceptor = interceptor;
    }

    setErrorInterceptor(interceptor: TErrorInterceptor): void {
        this.errorInterceptor = interceptor;
    }

    protected async processRequest(config: IRequestConfig): Promise<IRequestConfig> {
        return this.requestInterceptor?.(config) ?? config;
    }

    protected async processResponse<R>(response: IHttpClientResponse<R>): Promise<IHttpClientResponse<R>> {
        return this.responseInterceptor?.(response) ?? response;
    }

    protected async processError<R>(error: HttpClientError): Promise<never | IHttpClientResponse<R>> {
        if (this.errorInterceptor) {
            return this.errorInterceptor(error);
        }

        throw error;
    }
}
