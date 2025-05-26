import { HttpMethod } from './httpMethod.types';
import { Headers } from 'happy-dom';
import IHeadersInit from 'happy-dom/lib/fetch/types/IHeadersInit';

export type IHeaders = Record<string, string>;

export type TQueryParamValue = string | number | boolean;

export type TQueryParams = Record<string, TQueryParamValue>;

export const DEFAULT_REQUEST_TIMEOUT = 60000;

export interface IRequestClientOptions {
    url: string;
    method: HttpMethod;
    headers: IHeaders;
    queryParams: TQueryParams;
    body?: Object;
}

export type TRequestClient<T> = (arg: IRequestClientOptions) => void; //Promise<T>;

class HttpRequest<T> {
    protected requestClient: TRequestClient<T>;
    protected urlValue: string = '';
    protected method: HttpMethod;
    protected headersValue: IHeaders = {};
    protected queryParamsValue: TQueryParams = {};

    constructor(requestClient: TRequestClient<T>, method: HttpMethod) {
        this.requestClient = requestClient;
        this.method = method;
    }

    url(url: string): this {
        this.urlValue = url;

        return this;
    }

    headers(headers: IHeaders): this {
        Object.assign(this.headersValue, headers);

        return this;
    }

    queryParams(queryParams: TQueryParams): this {
        Object.assign(this.queryParamsValue, queryParams);

        return this;
    }

    send(): void /*Promise<T>*/ {
        return this.requestClient({
            url: this.urlValue,
            method: this.method,
            headers: this.headersValue,
            queryParams: this.queryParamsValue,
        });
    }
}

class HttpRequestWithBody<T> extends HttpRequest<T> {
    private bodyValue?: Object = {};

    body(body: Object): this {
        this.bodyValue = body;

        return this;
    }

    send(): void/*Promise<T>*/ {
        return super.requestClient({
            url: this.urlValue,
            method: super.method,
            headers: super.headersValue,
            queryParams: super.queryParamsValue,
            body: this.bodyValue
        })
    }
}

interface IHttpClientInit {
    headers?: IHeadersInit;
}

export interface IHttpClient {
    headers: Headers;
    requestClient<T>(arg: IRequestClientOptions): void; // Promise<T>;
    addHeader(key: string, value: string): HttpClient;
    get<T>(): HttpRequest<T>;
    post<T>(): HttpRequestWithBody<T>;
    put<T>(): HttpRequestWithBody<T>;
    patch<T>(): HttpRequestWithBody<T>;
    delete<T>(): HttpRequest<T>;
}

export class HttpClient implements IHttpClient {
    headers;
    requestClient;

    constructor({ headers }: IHttpClientInit) {
        this.headers = new Headers(headers);
        this.requestClient = function(arg: IRequestClientOptions): void {
            // fetch implementation
            // encodeURI(this.baseUrl.toString() + this.path),
        };
    }

    addHeader(key: string, value: string): HttpClient {
        this.headers.append(key, value);

        return this;
    };

    get<T>() {
        return new HttpRequest<T>(this.requestClient, HttpMethod.GET);
    }

    post<T>() {
        return new HttpRequestWithBody<T>(this.requestClient, HttpMethod.POST);
    }

    put<T>() {
        return new HttpRequestWithBody<T>(this.requestClient, HttpMethod.PUT);
    }

    patch<T>() {
        return new HttpRequestWithBody<T>(this.requestClient, HttpMethod.PATCH);
    }

    delete<T>() {
        return new HttpRequest<T>(this.requestClient, HttpMethod.DELETE);
    }
}

const test = new HttpClient({});

const getTest = test.post<{test: 'hello'}>().headers({ 'Content-Type': 'application/json' }).body(({ hello: 'test' }));
