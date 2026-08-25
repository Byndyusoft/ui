import { HTTP_METHODS } from '../constants';
import { assertValidAdapter, assertValidHttpClientOptions, assertValidRequestConfig } from '../asserts';
import { FetchAdapter } from '../adapters';
import {
    THttpMethod,
    IHttpRequestConfig,
    IHttpResponse,
    IHttpClientOptions,
    IHttpClientAdapter,
    THttpRequestExecutor,
    THttpRequestHook,
    THttpRequestErrorHook,
    THttpResponseHook,
    THttpResponseErrorHook
} from '../types';
import { HttpRequestBuilder } from './HttpRequestBuilder';
import { mergeHeaders, mergeParams } from '../utilities';

export class HttpClient {
    private readonly adapter: IHttpClientAdapter;
    private readonly defaultConfig: Pick<
        IHttpRequestConfig,
        'baseUrl' | 'headers' | 'timeout' | 'withCredentials' | 'params'
    >;
    private onRequestHook?: THttpRequestHook;
    private onRequestErrorHook?: THttpRequestErrorHook;
    private onResponseHook?: THttpResponseHook;
    private onResponseErrorHook?: THttpResponseErrorHook;

    constructor(options: IHttpClientOptions) {
        assertValidHttpClientOptions(options);

        this.adapter = options.adapter ?? new FetchAdapter();
        this.onRequestHook = options.onRequest;
        this.onRequestErrorHook = options.onRequestError;
        this.onResponseHook = options.onResponse;
        this.onResponseErrorHook = options.onResponseError;

        this.defaultConfig = {
            baseUrl: options.baseUrl,
            headers: mergeHeaders(options.headers),
            params: mergeParams(options.params),
            timeout: options.timeout,
            withCredentials: options.withCredentials
        };
    }

    /** Creates an independent client with the current defaults and hooks, using the provided adapter. */
    public withAdapter(adapter: IHttpClientAdapter): HttpClient {
        assertValidAdapter(adapter);

        return new HttpClient({
            ...this.defaultConfig,
            adapter,
            onRequest: this.onRequestHook,
            onRequestError: this.onRequestErrorHook,
            onResponse: this.onResponseHook,
            onResponseError: this.onResponseErrorHook
        });
    }

    /** Sets the onRequest hook, replacing the hook configured through constructor options. Returns this client for chaining. */
    public onRequest(hook: THttpRequestHook): this {
        this.onRequestHook = hook;

        return this;
    }

    /** Sets the onRequestError hook, replacing the hook configured through constructor options. Returns this client for chaining. */
    public onRequestError(hook: THttpRequestErrorHook): this {
        this.onRequestErrorHook = hook;

        return this;
    }

    /** Sets the onResponse hook, replacing the hook configured through constructor options. Returns this client for chaining. */
    public onResponse(hook: THttpResponseHook): this {
        this.onResponseHook = hook;

        return this;
    }

    /** Sets the onResponseError hook, replacing the hook configured through constructor options. Returns this client for chaining. */
    public onResponseError(hook: THttpResponseErrorHook): this {
        this.onResponseErrorHook = hook;

        return this;
    }

    private request(method: THttpMethod, url: string): HttpRequestBuilder {
        const executor: THttpRequestExecutor = <T>(config: IHttpRequestConfig): Promise<IHttpResponse<T>> =>
            this.executeRequest<T>(config);

        return new HttpRequestBuilder(executor, method, url);
    }

    public get(url: string): HttpRequestBuilder {
        return this.request(HTTP_METHODS.GET, url);
    }

    public head(url: string): HttpRequestBuilder {
        return this.request(HTTP_METHODS.HEAD, url);
    }

    public post(url: string): HttpRequestBuilder {
        return this.request(HTTP_METHODS.POST, url);
    }

    public put(url: string): HttpRequestBuilder {
        return this.request(HTTP_METHODS.PUT, url);
    }

    public delete(url: string): HttpRequestBuilder {
        return this.request(HTTP_METHODS.DELETE, url);
    }

    public options(url: string): HttpRequestBuilder {
        return this.request(HTTP_METHODS.OPTIONS, url);
    }

    public patch(url: string): HttpRequestBuilder {
        return this.request(HTTP_METHODS.PATCH, url);
    }

    private async executeRequest<T>(config: IHttpRequestConfig): Promise<IHttpResponse<T>> {
        const {
            onRequestHook: onRequest,
            onRequestErrorHook: onRequestError,
            onResponseHook: onResponse,
            onResponseErrorHook: onResponseError
        } = this;

        let mergedConfig: IHttpRequestConfig = {
            ...config,
            baseUrl: config.baseUrl ?? this.defaultConfig.baseUrl,
            timeout: config.timeout ?? this.defaultConfig.timeout,
            withCredentials: config.withCredentials ?? this.defaultConfig.withCredentials,
            headers: mergeHeaders(this.defaultConfig.headers, config.headers),
            params: mergeParams(this.defaultConfig.params, config.params)
        };

        if (onRequest !== undefined) {
            try {
                const requestConfig = await onRequest(mergedConfig);
                assertValidRequestConfig(requestConfig);
                mergedConfig = requestConfig;
            } catch (error) {
                if (onRequestError === undefined) {
                    throw error;
                }

                const recoveredConfig = await onRequestError(error);

                if (recoveredConfig === undefined) {
                    throw error;
                }

                assertValidRequestConfig(recoveredConfig);
                mergedConfig = recoveredConfig;
            }
        }

        try {
            let response = await this.adapter.request<unknown>(mergedConfig);

            if (onResponse !== undefined) {
                response = await onResponse(response);
            }

            return response as IHttpResponse<T>;
        } catch (error) {
            if (onResponseError === undefined) {
                throw error;
            }

            const recoveredResponse = await onResponseError(error);

            if (recoveredResponse === undefined) {
                throw error;
            }

            return recoveredResponse as IHttpResponse<T>;
        }
    }
}
