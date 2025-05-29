import { HttpMethod } from '../types/httpMethod.types';

export type IHeaders = Record<string, string>;

export type TQueryParamValue = string | number | boolean;

export type TQueryParams = Record<string, TQueryParamValue>;

export interface IRequestClientOptions {
    url: string;
    method: HttpMethod;
    headers: IHeaders;
    params: TQueryParams;
    body?: Object;
}

export type TRequestClient<T> = (arg: IRequestClientOptions) => Promise<T>;

export class HttpRequest<T> {
    protected requestClient: TRequestClient<T>;
    protected urlValue: string = '';
    protected method: HttpMethod;
    protected headersValue: IHeaders = {};
    protected paramsValue: TQueryParams = {};

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

    params(queryParams: TQueryParams): this {
        Object.assign(this.paramsValue, queryParams);

        return this;
    }

    send(): Promise<T> {
        return this.requestClient({
            url: this.urlValue,
            method: this.method,
            headers: this.headersValue,
            params: this.paramsValue,
        });
    }
}

export class HttpRequestWithBody<T> extends HttpRequest<T> {
    private bodyValue?: Object = {};

    body(body: Object): this {
        this.bodyValue = body;

        return this;
    }

    send(): Promise<T> {
        return super.requestClient({
            url: this.urlValue,
            method: super.method,
            headers: super.headersValue,
            params: super.paramsValue,
            body: this.bodyValue
        })
    }
}
