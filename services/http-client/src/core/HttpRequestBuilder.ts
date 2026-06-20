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

        return this.mutateConfig({ baseUrl: value });
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
        if (this.config.method === 'GET' || this.config.method === 'HEAD') {
            // Возможно ещё и для DELETE
            throw new RequestBuilderError('Body is not allowed for GET or HEAD requests');
        }

        // if (typeof data !== 'object') {
        //     throw new RequestBuilderError('Data must be an object');
        // }

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

    // public credentials(credentials: RequestCredentials): this {
    //     this.config.credentials = credentials;
    //     return this;
    // }

    // public mode(mode: RequestMode): this {
    //     this.config.mode = mode;
    //     return this;
    // }

    // public cache(cache: RequestCache): this {
    //     this.config.cache = cache;
    //     return this;
    // }

    // public redirect(redirect: RequestRedirect): this {
    //     this.config.redirect = redirect;
    //     return this;
    // }

    // public referrer(referrer: string): this {
    //     this.config.referrer = referrer;
    //     return this;
    // }

    // public integrity(integrity: string): this {
    //     this.config.integrity = integrity;
    //     return this;
    // }

    // public keepalive(keepalive: boolean): this {
    //     this.config.keepalive = keepalive;
    //     return this;
    // }

    // public keepalive(value: boolean): this {
    //     this.config = { ...this.config, keepalive: value };

    //     return this;
    // }

    // public cache(value: RequestCache): this {
    //     this.config = { ...this.config, cache: value };

    //     return this;
    // }

    // public credentials(value: RequestCredentials): this {
    //     this.config = { ...this.config, credentials: value };

    //     return this;
    // }

    // public mode(value: RequestMode): this {
    //     this.config = { ...this.config, mode: value };

    //     return this;
    // }
    //
    // public redirect(value: RequestRedirect): this {
    //     this.config = { ...this.config, redirect: value };

    //     return this;
    // }

    // public referrer(value: string): this {
    //     this.config = { ...this.config, referrer: value };

    //     return this;
    // }

    // withCredentials(value: boolean): this {
    //     this.config.withCredentials = value;
    //     return this;
    // }

    // json(): this {
    //     this.header("Content-Type", "application/json");
    //     return this;
    // }

    // form(): this {
    //     this.header("Content-Type", "application/x-www-form-urlencoded");
    //     return this;
    // }

    // multipart(): this {
    //     this.header("Content-Type", "multipart/form-data");
    //     return this;
    // }

    // acceptJson(): this {
    //     this.header("Accept", "application/json");
    //     return this;
    // }

    public execute<T>(): Promise<IHttpResponse<T>> {
        if (!this.config.url) {
            throw new RequestBuilderError('URL must be set before executing');
        }

        if (!this.config.method) {
            throw new RequestBuilderError('Method must be set before executing');
        }

        if (!this.executor) {
            throw new RequestBuilderError('Executor must be set before executing');
        }

        return this.executor(this.config) as Promise<IHttpResponse<T>>;
    }
}
