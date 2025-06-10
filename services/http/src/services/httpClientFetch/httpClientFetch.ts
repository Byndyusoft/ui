import { IRequestOptions } from '../httpRequest';
import { HttpClient, IHttpClientInit } from '../httpClient';
import { IHttpClientResponse, HttpClientError } from '../../types/httpClient.types';

const combineAbortSignals = (signals: Array<AbortSignal | undefined>): AbortSignal => {
    const controller = new AbortController();

    signals.forEach(signal => {
        if (!signal) return;

        if (signal.aborted) {
            controller.abort();
        } else {
            signal.addEventListener('abort', () => controller.abort());
        }
    });

    return controller.signal;
};

export class HttpClientFetch extends HttpClient {
    requestClient;

    constructor(initSettings: IHttpClientInit) {
        super(initSettings);

        this.requestClient = async <R, E>(options: IRequestOptions): Promise<IHttpClientResponse<R>> => {
            const url = encodeURI(`${this.baseURL}${options.url}`) + HttpClient.buildQueryString(options.params);
            const headers = Object.assign(this.headers, options.headers);

            const timeoutSignal = AbortSignal.timeout(this.timeout);
            const combinedSignals = combineAbortSignals([timeoutSignal, options.signal])

            const response = await fetch(url, {
                method: options.method,
                headers,
                body: JSON.stringify(options.body),
                signal: combinedSignals
            }).catch(error => {
                if (error.name === 'AbortError') {
                    throw new HttpClientError({
                        code: error.code,
                        message: timeoutSignal.aborted ? `Timeout of ${this.timeout}ms exceeded` : 'The request was cancelled'
                    });
                }

                throw new HttpClientError({
                    code: error.code,
                    message: error.message
                });
            });

            const contentType = response.headers.get('Content-Type');

            let data;

            if (contentType?.includes('application/json')) {
                data = await response.json();
            } else if (contentType?.includes('text/')) {
                data = (await response.text());
            } else {
                data = (await response.blob());
            }

            if (!response.ok) {
                throw new HttpClientError({
                    message: `Request failed with status ${response.status}`,
                    code: `ERR_${response.statusText.toUpperCase().replace(' ', '_')}`,
                    response: {
                        data: data as E,
                        status: response.status,
                        statusText: response.statusText,
                        headers: Object.fromEntries(response.headers.entries()),
                    }
                });
            }

            return {
                data: data as R,
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries()),
            };
        };
    }
}
