import { HTTP_RESPONSE_TYPES, REQUEST_BUILDER_ERROR_CODES } from '../constants';
import { RequestBuilderError } from '../errors';
import {
    THttpMethod,
    IHttpRequestConfig,
    IHttpResponse,
    THttpHeaders,
    THttpParams,
    THttpParamValue,
    THttpRequestExecutor
} from '../types';
import {
    HEADER_VALUE_LINE_BREAK_PATTERN,
    assertValidBody,
    assertNonBlankString,
    assertValidBaseUrl,
    assertValidHeader,
    assertValidHeaders,
    assertValidMethod,
    assertValidParam,
    assertValidParams,
    assertValidRequestConfig,
    assertValidSignal,
    assertValidTimeout,
    assertValidUrl,
    assertValidValidateStatus,
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
export class HttpRequestBuilder<TResponse = unknown> {
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

    private withConfig<TNextResponse = TResponse>(partial: TBuilderConfigPatch): HttpRequestBuilder<TNextResponse> {
        const builder = new HttpRequestBuilder<TNextResponse>(this.executor, this.config.method, this.config.url);
        builder.config = cloneConfig({ ...this.config, ...partial });

        return builder;
    }

    public build(): Readonly<IHttpRequestConfig> {
        assertValidRequestConfig(this.config);

        return cloneConfig(this.config);
    }

    public baseUrl(value: string): HttpRequestBuilder<TResponse> {
        assertValidBaseUrl(value);

        return this.withConfig({ baseUrl: value });
    }

    public header(key: string, value: string): HttpRequestBuilder<TResponse> {
        assertValidHeader(key, value);

        return this.withConfig({ headers: mergeHeaders(this.config.headers, { [key]: value }) });
    }

    public headers(headers: THttpHeaders): HttpRequestBuilder<TResponse> {
        assertValidHeaders(headers);

        return this.withConfig({ headers: mergeHeaders(this.config.headers, headers) });
    }

    public param(key: string, value: THttpParamValue): HttpRequestBuilder<TResponse> {
        assertValidParam(key, value);

        return this.withConfig({
            params: mergeParams(this.config.params, { [key]: value })
        });
    }

    public params(params: THttpParams): HttpRequestBuilder<TResponse> {
        assertValidParams(params);

        return this.withConfig({
            params: mergeParams(this.config.params, params)
        });
    }

    public body(data: unknown): HttpRequestBuilder<TResponse> {
        assertValidBody(this.config.method, data);

        return this.withConfig({ data });
    }

    public signal(signal: AbortSignal): HttpRequestBuilder<TResponse> {
        assertValidSignal(signal);

        return this.withConfig({ signal });
    }

    /** A zero timeout disables the request timeout, including a timeout inherited from the client config. */
    public timeout(timeout: number): HttpRequestBuilder<TResponse> {
        assertValidTimeout(timeout);

        return this.withConfig({ timeout });
    }

    /** Determines whether a response status should be treated as successful. */
    public validateStatus(
        validateStatus: NonNullable<IHttpRequestConfig['validateStatus']>
    ): HttpRequestBuilder<TResponse> {
        assertValidValidateStatus(validateStatus);

        return this.withConfig({ validateStatus });
    }

    /** Includes credentials in cross-origin requests. */
    public withCredentials(withCredentials: boolean): HttpRequestBuilder<TResponse> {
        assertValidWithCredentials(withCredentials);

        return this.withConfig({ withCredentials });
    }

    public bearer(token: string): HttpRequestBuilder<TResponse> {
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

    public asJson<T>(): HttpRequestBuilder<T> {
        return this.withConfig<T>({ responseType: HTTP_RESPONSE_TYPES.JSON });
    }

    public asText(): HttpRequestBuilder<string> {
        return this.withConfig<string>({ responseType: HTTP_RESPONSE_TYPES.TEXT });
    }

    public asBlob(): HttpRequestBuilder<Blob> {
        return this.withConfig<Blob>({ responseType: HTTP_RESPONSE_TYPES.BLOB });
    }

    public asArrayBuffer(): HttpRequestBuilder<ArrayBuffer> {
        return this.withConfig<ArrayBuffer>({ responseType: HTTP_RESPONSE_TYPES.ARRAY_BUFFER });
    }

    public asStream(): HttpRequestBuilder<ReadableStream<Uint8Array>> {
        return this.withConfig<ReadableStream<Uint8Array>>({ responseType: HTTP_RESPONSE_TYPES.STREAM });
    }

    public execute(): Promise<IHttpResponse<TResponse>> {
        return this.executor<TResponse>(this.build());
    }
}
