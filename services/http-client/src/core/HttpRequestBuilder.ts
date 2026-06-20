import { HTTP_RESPONSE_TYPES } from '../constants';
import { RequestBuilderError } from '../errors';
import {
    THttpMethod,
    IHttpRequestConfig,
    IHttpResponse,
    THttpHeaders,
    THttpParams,
    THttpResponseType,
    THttpParamValue
} from '../types';

type TExecutor = (config: IHttpRequestConfig) => Promise<IHttpResponse<unknown>>;

export class HttpRequestBuilder {
    private executor: TExecutor;
    private config: IHttpRequestConfig;

    constructor(executor: TExecutor, method: THttpMethod, url: string) {
        this.executor = executor;
        this.config = { method, url };
    }

    private mutateConfig(partial: Partial<IHttpRequestConfig>): this {
        this.config = { ...this.config, ...partial };

        return this;
    }

    public baseURL(value: string): this {
        if (!value) {
            throw new RequestBuilderError('Base URL must be a non-empty string');
        }

        return this.mutateConfig({ baseURL: value });
    }

    public header(key: string, value: string): this {
        if (!key) {
            throw new RequestBuilderError('Header key must be a non-empty string');
        }

        return this.mutateConfig({ headers: { ...this.config.headers, [key]: value } });
    }

    public headers(headers: THttpHeaders): this {
        if (!headers || typeof headers !== 'object') {
            throw new RequestBuilderError('Headers must be an object');
        }

        return this.mutateConfig({ headers: { ...this.config.headers, ...headers } });
    }

    public param(key: string, value: THttpParamValue): this {
        if (!key) {
            throw new RequestBuilderError('Param key must be a non-empty string');
        }

        return this.mutateConfig({ params: { ...this.config.params, [key]: value } });
    }

    public params(params: THttpParams): this {
        if (!params || typeof params !== 'object') {
            throw new RequestBuilderError('Params must be an object');
        }

        return this.mutateConfig({ params: { ...this.config.params, ...params } });
    }

    public body(data: unknown): this {
        return this.mutateConfig({ data });
    }

    public signal(signal: AbortSignal): this {
        return this.mutateConfig({ signal });
    }

    public timeout(timeout: number): this {
        if (!Number.isFinite(timeout) || timeout < 0) {
            throw new RequestBuilderError('Timeout must be a finite non-negative number');
        }

        return this.mutateConfig({ timeout });
    }

    public bearer(token: string): this {
        if (!token) {
            throw new RequestBuilderError('Bearer token must be a non-empty string');
        }

        return this.header('Authorization', `Bearer ${token}`);
    }

    public responseType(responseType: THttpResponseType): this {
        if (!Object.values(HTTP_RESPONSE_TYPES).includes(responseType)) {
            throw new RequestBuilderError('Response type must be a valid HTTP response type');
        }

        return this.mutateConfig({ responseType });
    }

    public execute<T>(): Promise<IHttpResponse<T>> {
        if (!this.config.url) {
            throw new RequestBuilderError('URL must be set before executing');
        }

        return this.executor(this.config) as Promise<IHttpResponse<T>>;
    }
}
