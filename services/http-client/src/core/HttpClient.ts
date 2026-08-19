import { HTTP_METHODS } from '../constants';
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
import { mergeHeaders } from '../utilities';

export class HttpClient {
    private readonly adapter: IHttpClientAdapter;
    private readonly defaultConfig: Pick<IHttpRequestConfig, 'baseUrl' | 'headers' | 'timeout' | 'params'>;
    private onRequestHook?: THttpRequestHook;
    private onRequestErrorHook?: THttpRequestErrorHook;
    private onResponseHook?: THttpResponseHook;
    private onResponseErrorHook?: THttpResponseErrorHook;

    constructor(options: IHttpClientOptions) {
        this.adapter = options.adapter;
        this.onRequestHook = options.onRequest;
        this.onRequestErrorHook = options.onRequestError;
        this.onResponseHook = options.onResponse;
        this.onResponseErrorHook = options.onResponseError;

        this.defaultConfig = {
            baseUrl: options.baseUrl,
            headers: options.headers,
            timeout: options.timeout
        };
    }

    /** Устанавливает хук onRequest, заменяя заданный через опции конструктора. Возвращает клиент для чейнинга. */
    public onRequest(hook: THttpRequestHook): this {
        this.onRequestHook = hook;

        return this;
    }

    /** Устанавливает хук onRequestError, заменяя заданный через опции конструктора. Возвращает клиент для чейнинга. */
    public onRequestError(hook: THttpRequestErrorHook): this {
        this.onRequestErrorHook = hook;

        return this;
    }

    /** Устанавливает хук onResponse, заменяя заданный через опции конструктора. Возвращает клиент для чейнинга. */
    public onResponse(hook: THttpResponseHook): this {
        this.onResponseHook = hook;

        return this;
    }

    /** Устанавливает хук onResponseError, заменяя заданный через опции конструктора. Возвращает клиент для чейнинга. */
    public onResponseError(hook: THttpResponseErrorHook): this {
        this.onResponseErrorHook = hook;

        return this;
    }

    private request(method: THttpMethod, url: string): HttpRequestBuilder {
        const executor: THttpRequestExecutor = <T>(config: IHttpRequestConfig): Promise<IHttpResponse<T>> =>
            this.execute<T>(config);

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

    private async execute<T>(config: IHttpRequestConfig): Promise<IHttpResponse<T>> {
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
            headers: mergeHeaders(this.defaultConfig.headers, config.headers),
            params: { ...this.defaultConfig.params, ...config.params }
        };

        if (onRequest !== undefined) {
            try {
                mergedConfig = await onRequest(mergedConfig);
            } catch (error) {
                if (onRequestError === undefined) {
                    throw error;
                }

                const recoveredConfig = await onRequestError(error);

                if (recoveredConfig === undefined) {
                    throw error;
                }

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
