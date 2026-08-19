import { REQUEST_BUILDER_ERROR_CODES } from '../constants';
import { RequestBuilderError } from '../errors';
import {
    THttpMethod,
    IHttpRequestConfig,
    IHttpResponse,
    THttpHeaders,
    THttpParams,
    THttpResponseType,
    THttpParamValue,
    THttpRequestExecutor
} from '../types';
import {
    HEADER_VALUE_LINE_BREAK_PATTERN,
    assertBodyAllowed,
    assertNonBlankString,
    assertValidBaseUrl,
    assertValidHeader,
    assertValidHeaders,
    assertValidMethod,
    assertValidParam,
    assertValidParams,
    assertValidResponseType,
    assertValidSignal,
    assertValidTimeout,
    assertValidUrl
} from '../asserts';
import { mergeHeaders, mergeParams } from '../utilities';

type TBuilderConfigPatch = Partial<Omit<IHttpRequestConfig, 'method' | 'url'>>;

function cloneConfig(config: IHttpRequestConfig): IHttpRequestConfig {
    return {
        ...config,
        ...(config.headers === undefined ? {} : { headers: { ...config.headers } }),
        ...(config.params === undefined ? {} : { params: mergeParams(config.params) })
    };
}

/**
 * Builds request configs immutably. Every configuration method returns a new builder instance.
 */
export class HttpRequestBuilder {
    private readonly executor: THttpRequestExecutor;
    private config: IHttpRequestConfig;

    constructor(executor: THttpRequestExecutor, method: THttpMethod, url: string) {
        if (typeof executor !== 'function') {
            throw new RequestBuilderError('Executor must be a function', REQUEST_BUILDER_ERROR_CODES.INVALID_EXECUTOR);
        }

        assertValidMethod(method);
        assertValidUrl(url);

        this.executor = executor;
        this.config = { method, url };
    }

    private withConfig(partial: TBuilderConfigPatch): HttpRequestBuilder {
        const builder = new HttpRequestBuilder(this.executor, this.config.method, this.config.url);
        builder.config = cloneConfig({ ...this.config, ...partial });

        return builder;
    }

    public build(): Readonly<IHttpRequestConfig> {
        assertValidMethod(this.config.method);
        assertValidUrl(this.config.url);

        if (this.config.baseUrl !== undefined) {
            assertValidBaseUrl(this.config.baseUrl);
        }

        if (this.config.headers !== undefined) {
            assertValidHeaders(this.config.headers);
        }

        if (this.config.params !== undefined) {
            assertValidParams(this.config.params);
        }

        if (this.config.signal !== undefined) {
            assertValidSignal(this.config.signal);
        }

        if (this.config.timeout !== undefined) {
            assertValidTimeout(this.config.timeout);
        }

        if (this.config.responseType !== undefined) {
            assertValidResponseType(this.config.responseType);
        }

        if (Object.prototype.hasOwnProperty.call(this.config, 'data')) {
            assertBodyAllowed(this.config.method);
        }

        return cloneConfig(this.config);
    }

    public baseUrl(value: string): HttpRequestBuilder {
        assertValidBaseUrl(value);

        return this.withConfig({ baseUrl: value });
    }

    public header(key: string, value: string): HttpRequestBuilder {
        assertValidHeader(key, value);

        return this.withConfig({ headers: mergeHeaders(this.config.headers, { [key]: value }) });
    }

    public headers(headers: THttpHeaders): HttpRequestBuilder {
        assertValidHeaders(headers);

        return this.withConfig({ headers: mergeHeaders(this.config.headers, headers) });
    }

    public param(key: string, value: THttpParamValue): HttpRequestBuilder {
        assertValidParam(key, value);

        return this.withConfig({
            params: mergeParams(this.config.params, { [key]: value })
        });
    }

    public params(params: THttpParams): HttpRequestBuilder {
        assertValidParams(params);

        return this.withConfig({
            params: mergeParams(this.config.params, params)
        });
    }

    public body(data: unknown): HttpRequestBuilder {
        // Возможно ещё и для DELETE
        assertBodyAllowed(this.config.method);

        // if (typeof data !== 'object') {
        //     throw new RequestBuilderError('Data must be an object');
        // }

        return this.withConfig({ data });
    }

    public signal(signal: AbortSignal): HttpRequestBuilder {
        assertValidSignal(signal);

        return this.withConfig({ signal });
    }

    /** A zero timeout disables the request timeout, including a timeout inherited from the client config. */
    public timeout(timeout: number): HttpRequestBuilder {
        assertValidTimeout(timeout);

        return this.withConfig({ timeout });
    }

    public bearer(token: string): HttpRequestBuilder {
        assertNonBlankString(
            token,
            'Bearer token must be a non-empty string',
            REQUEST_BUILDER_ERROR_CODES.INVALID_BEARER_TOKEN
        );

        if (HEADER_VALUE_LINE_BREAK_PATTERN.test(token)) {
            throw new RequestBuilderError(
                'Bearer token must not contain line breaks',
                REQUEST_BUILDER_ERROR_CODES.INVALID_BEARER_TOKEN
            );
        }

        return this.header('Authorization', `Bearer ${token}`);
    }

    public responseType(responseType: THttpResponseType): HttpRequestBuilder {
        assertValidResponseType(responseType);

        return this.withConfig({ responseType });
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

    public execute<T = unknown>(): Promise<IHttpResponse<T>> {
        return this.executor<T>(this.build());
    }
}
