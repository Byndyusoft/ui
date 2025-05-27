import { HttpRequest, HttpRequestWithBody, IHeaders, IRequestClientOptions, TQueryParams } from './httpRequest';
import { HttpMethod } from './httpMethod.types';
import { DEFAULT_REQUEST_TIMEOUT, IHttpClient, IHttpClientInit } from './httpClient.types';

export class FetchHttpClient implements IHttpClient {
    baseURL: string;
    headers: IHeaders = {};
    timeout: number;
    requestClient;

    constructor({ baseURL, headers, timeout }: IHttpClientInit) {
        this.baseURL = baseURL;
        this.headers = Object.assign(this.headers, headers);
        this.timeout = timeout ?? DEFAULT_REQUEST_TIMEOUT;
        this.requestClient = function<R>(arg: IRequestClientOptions): Promise<R> {
            const url = encodeURI(`${this.baseURL}${arg.url}`) + this.buildQueryString(arg.params);
            const headers = Object.assign(this.headers, arg.headers);

            return fetch(url, { method: arg.method, headers, body: JSON.stringify(arg.body) }) as Promise<R>;
        };
    }

    buildQueryString(queryParams: TQueryParams) {
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

    delete<R>() {
        return new HttpRequest<R>(this.requestClient, HttpMethod.DELETE);
    }
}
