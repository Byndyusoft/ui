import axios, { AxiosError } from 'axios';
import { HttpClient, IHttpClientInit } from '../httpClient';
import { IRequestOptions } from '../httpRequest';
import { HttpClientError, IHttpClientResponse } from '../../types/httpClient.types';
import { combineAbortSignals } from '../../utilities/httpClient.utilities';

export class HttpClientAxios extends HttpClient {
    requestClient;

    constructor(initSettings: IHttpClientInit) {
        super(initSettings);

        this.requestClient = async <R, E>(options: IRequestOptions): Promise<IHttpClientResponse<R>> => {
            const processedConfig = await this.processRequest({
                url: options.url,
                method: options.method,
                baseURL: this.baseURL,
                headers: { ...this.headers, ...options.headers },
                params: options.params,
                data: options.body
            });

            const timeoutSignal = AbortSignal.timeout(this.timeout);
            const combinedSignals = combineAbortSignals(timeoutSignal, options.signal);

            return axios<R>({
                ...processedConfig,
                signal: combinedSignals
            })
                .then(response => ({
                    data: response.data,
                    status: response.status,
                    statusText: response.statusText,
                    headers: Object.fromEntries(Object.entries(response.headers)),
                    config: processedConfig
                }))
                .catch((error: AxiosError<E>) => {
                    let message: string;

                    if (error.code === 'ERR_CANCELED') {
                        message = timeoutSignal.aborted
                            ? `Timeout of ${this.timeout}ms exceeded`
                            : 'The request was cancelled';
                    } else {
                        message = error.message;
                    }

                    throw new HttpClientError({
                        message: message,
                        code: error.code,
                        response: error.response ? {
                            data: error.response.data,
                            status: error.response.status,
                            statusText: error.response.statusText,
                            headers: Object.fromEntries(Object.entries(error.response.headers))
                        } : undefined,
                        config: processedConfig
                    });
                });
        };
    }
}
