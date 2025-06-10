import axios, { AxiosError } from 'axios';
import { HttpClient, IHttpClientInit } from '../httpClient';
import { IRequestOptions } from '../httpRequest';
import { HttpClientError, IHttpClientResponse } from '../../types/httpClient.types';

export class HttpClientAxios extends HttpClient {
    requestClient;

    constructor(initSettings: IHttpClientInit) {
        super(initSettings);

        this.requestClient = <R, E>(options: IRequestOptions): Promise<IHttpClientResponse<R>> =>
            axios<R>({
                baseURL: this.baseURL,
                url: options.url,
                method: options.method,
                headers: { ...this.headers, ...options.headers },
                params: options.params,
                data: options.body,
                signal: options.signal,
                timeout: this.timeout,
                timeoutErrorMessage: `Timeout of ${this.timeout}ms exceeded`
            })
                .then(response => ({
                    data: response.data,
                    status: response.status,
                    statusText: response.statusText,
                    headers: Object.fromEntries(Object.entries(response.headers))
                }))
                .catch((error: AxiosError<E>) => {
                    const message = (error.code === 'ERR_CANCELED' && options.signal?.aborted)
                        ? 'The request was cancelled'
                        : error.message;

                    throw new HttpClientError({
                        message: message,
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
}
