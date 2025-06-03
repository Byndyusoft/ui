import { HttpMethod } from '../types/httpMethod.types';
import { IHttpClientResponse, THeaders, TQueryParams } from '../types/httpClient.types';

export interface IRequestClientOptions {
    url: string;
    method: HttpMethod;
    headers: THeaders;
    params: TQueryParams;
    body?: Object;
}

export type TRequestClient<T> = (arg: IRequestClientOptions) => Promise<IHttpClientResponse<T>>;

export class HttpRequest<T> {
    protected requestClient: TRequestClient<T>;
    protected urlValue: string = '';
    protected method: HttpMethod;
    protected headersValue: THeaders = {};
    protected paramsValue: TQueryParams = {};

    constructor(requestClient: TRequestClient<T>, method: HttpMethod) {
        this.requestClient = requestClient;
        this.method = method;
    }

    url(url: string): this {
        this.urlValue = url;

        return this;
    }

    headers(headers: THeaders): this {
        Object.assign(this.headersValue, headers);

        return this;
    }

    params(queryParams: TQueryParams): this {
        Object.assign(this.paramsValue, queryParams);

        return this;
    }

    send(): Promise<IHttpClientResponse<T>> {
        return this.requestClient({
            url: this.urlValue,
            method: this.method,
            headers: this.headersValue,
            params: this.paramsValue,
        });
    }
}

export class HttpRequestWithBody<T> extends HttpRequest<T> {
    private bodyValue?: object = {};

    body<B extends object>(body: B): this {
        this.bodyValue = body;

        return this;
    }

    send(): Promise<IHttpClientResponse<T>> {
        return this.requestClient({
            url: this.urlValue,
            method: this.method,
            headers: this.headersValue,
            params: this.paramsValue,
            body: this.bodyValue
        })
    }
}
