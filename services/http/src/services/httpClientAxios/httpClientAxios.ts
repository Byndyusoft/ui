import axios, { AxiosInstance, AxiosError } from 'axios';
import { HttpClient, IHttpClientInit, DEFAULT_REQUEST_TIMEOUT } from '../httpClient';
import { IRequestOptions } from '../httpRequest';
import { HttpClientError, IHttpClientResponse } from '../../types/httpClient.types';

export class HttpClientAxios extends HttpClient {
    requestClient;
    private axiosInstance: AxiosInstance;

    constructor({ baseURL, headers, timeout }: IHttpClientInit) {
        super();

        this.axiosInstance = axios.create({
            baseURL,
            headers,
            timeout: timeout ?? DEFAULT_REQUEST_TIMEOUT,
            timeoutErrorMessage: `Timeout of ${timeout ?? DEFAULT_REQUEST_TIMEOUT}ms exceeded`
        });

        this.requestClient = <R, E>(options: IRequestOptions): Promise<IHttpClientResponse<R>> =>
            this.axiosInstance<R>({
                url: options.url,
                method: options.method,
                headers: options.headers,
                params: options.params,
                data: options.body,
                signal: options.signal
            })
                .then(response => ({
                    data: response.data,
                    status: response.status,
                    statusText: response.statusText,
                    headers: Object.fromEntries(Object.entries(response.headers))
                }))
                .catch((error: AxiosError<E>) => {
                    if (error.code === 'ERR_CANCELED') {
                        throw new HttpClientError({
                            code: error.code,
                            message: options.signal?.aborted ? 'The request was cancelled' : error.message
                        });
                    }

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
