import axios, { AxiosInstance, AxiosError } from 'axios';
import { HttpClient, IHttpClientInit, DEFAULT_REQUEST_TIMEOUT } from '../httpClient';
import { IRequestClientOptions } from '../httpRequest';
import { HttpClientError, IHttpClientResponse } from '../../types/httpClient.types';

export class HttpClientAxios extends HttpClient {
    requestClient;
    private axiosInstance: AxiosInstance;

    constructor({ baseURL, headers, timeout }: IHttpClientInit) {
        super();

        this.axiosInstance = axios.create({
            baseURL,
            headers,
            timeout: timeout ?? DEFAULT_REQUEST_TIMEOUT
        });

        this.requestClient = <R, E>(arg: IRequestClientOptions): Promise<IHttpClientResponse<R>> =>
            this.axiosInstance<R>({ url: arg.url, method: arg.method, headers: arg.headers, params: arg.params, data: arg.body })
                .then(response => ({
                    data: response.data,
                    status: response.status,
                    statusText: response.statusText,
                    headers: Object.fromEntries(Object.entries(response.headers))
                }))
                .catch((error: AxiosError<E>) => {
                    throw new HttpClientError({
                        message: error.message,
                        code: error.code,
                        response: error.response ? {
                            data: error.response.data,
                            status: error.response.status,
                            statusText: error.response.statusText,
                            headers: Object.fromEntries(Object.entries(error.response.headers))
                        } : undefined
                    });
                });
    }

    setHeader(key: string, value: string): void {
        this.axiosInstance.defaults.headers[key] = value;
    };
}
