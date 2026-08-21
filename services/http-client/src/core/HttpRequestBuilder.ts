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
    assertValidRequestConfig,
    assertValidResponseType,
    assertValidSignal,
    assertValidTimeout,
    assertValidUrl,
    assertValidWithCredentials
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
        assertValidRequestConfig(this.config);

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
        assertBodyAllowed(this.config.method);

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

    /** Includes credentials in cross-origin requests. */
    public withCredentials(withCredentials: boolean): HttpRequestBuilder {
        assertValidWithCredentials(withCredentials);

        return this.withConfig({ withCredentials });
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

    public execute<T = unknown>(): Promise<IHttpResponse<T>> {
        return this.executor<T>(this.build());
    }
}
