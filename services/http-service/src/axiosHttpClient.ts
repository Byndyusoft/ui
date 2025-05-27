import axios, { AxiosInstance } from 'axios';
import { IHttpClient, IHttpClientInit, DEFAULT_REQUEST_TIMEOUT } from './httpClient.types';
import { HttpRequest, HttpRequestWithBody, IRequestClientOptions } from './httpRequest';
import { HttpMethod } from './httpMethod.types';

export class AxiosHttpClient implements IHttpClient {
    requestClient;
    private axiosInstance: AxiosInstance;

    constructor({ baseURL, headers, timeout }: IHttpClientInit) {
        this.axiosInstance = axios.create({
            baseURL,
            headers,
            timeout: timeout ?? DEFAULT_REQUEST_TIMEOUT
        });

        this.requestClient = function<R>(arg: IRequestClientOptions): Promise<R> {
            return this.axiosInstance({ url: arg.url, method: arg.method, headers: arg.headers, params: arg.params, data: arg.body });
        };
    }

    setHeader(key: string, value: string): void {
        this.axiosInstance.defaults.headers[key] = value;
    };

    get<R>() {
        return new HttpRequest<R>(this.requestClient, HttpMethod.GET);
    }

    post<R>() {
        return new HttpRequestWithBody<R>(this.requestClient, HttpMethod.POST);
    }

    put<R>() {
        return new HttpRequestWithBody<R>(this.requestClient, HttpMethod.PUT);
    }

    patch<R>() {
        return new HttpRequestWithBody<R>(this.requestClient, HttpMethod.PATCH);
    }

    delete<R>() {
        return new HttpRequest<R>(this.requestClient, HttpMethod.DELETE);
    }
}