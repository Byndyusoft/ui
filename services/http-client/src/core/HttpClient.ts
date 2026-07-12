import { HTTP_METHODS } from '../constants';
import {
    THttpMethod,
    IHttpRequestConfig,
    IHttpResponse,
    IHttpClientOptions,
    IHttpClientAdapter,
    THttpRequestExecutor
} from '../types';
import { HttpRequestBuilder } from './HttpRequestBuilder';

export class HttpClient {
    private readonly adapter: IHttpClientAdapter;
    private readonly defaultConfig: Pick<IHttpRequestConfig, 'baseUrl' | 'headers' | 'timeout' | 'params'>;

    constructor(options: IHttpClientOptions) {
        this.adapter = options.adapter;

        this.defaultConfig = {
            baseUrl: options.baseUrl,
            headers: options.headers,
            timeout: options.timeout
        };
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

    public connect(url: string): HttpRequestBuilder {
        return this.request(HTTP_METHODS.CONNECT, url);
    }

    public options(url: string): HttpRequestBuilder {
        return this.request(HTTP_METHODS.OPTIONS, url);
    }

    public trace(url: string): HttpRequestBuilder {
        return this.request(HTTP_METHODS.TRACE, url);
    }

    public patch(url: string): HttpRequestBuilder {
        return this.request(HTTP_METHODS.PATCH, url);
    }

    private execute<T>(config: IHttpRequestConfig): Promise<IHttpResponse<T>> {
        const mergedConfig: IHttpRequestConfig = {
            ...config,
            baseUrl: config.baseUrl ?? this.defaultConfig.baseUrl,
            timeout: config.timeout ?? this.defaultConfig.timeout,
            headers: { ...this.defaultConfig.headers, ...config.headers },
            params: { ...this.defaultConfig.params, ...config.params }
        };

        return this.adapter.request<T>(mergedConfig);
    }
}
