import { IRequestOptions } from '../httpRequest';
import { HttpClient, IHttpClientInit } from '../httpClient';
import { IHttpClientResponse, HttpClientError } from '../../types/httpClient.types';
import { combineAbortSignals } from '../../utilities/httpClient.utilities';

export class HttpClientFetch extends HttpClient {
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

            const url = encodeURI(`${processedConfig.baseURL}${processedConfig.url}`) + HttpClient.buildQueryString(processedConfig.params ?? {});
            const timeoutSignal = AbortSignal.timeout(this.timeout);
            const combinedSignals = combineAbortSignals(timeoutSignal, options.signal);

            const response = await fetch(url, {
                method: processedConfig.method,
                headers: processedConfig.headers,
                body: JSON.stringify(processedConfig.data),
                signal: combinedSignals
            }).catch(error => {
                let message: string;

                if (error.name === 'AbortError') {
                    message = timeoutSignal.aborted
                        ? `Timeout of ${this.timeout}ms exceeded`
                        : 'The request was cancelled';
                } else {
                    message = error.message;
                }

                throw new HttpClientError({
                    code: error.code,
                    message: message,
                    config: processedConfig
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
                // TODO: через интерцептор проходят только те ошибки, которые генерируются если response.ok === false,
                //  надо обсудить достаточно ли этого
                return this.processError(new HttpClientError({
                    message: `Request failed with status ${response.status}`,
                    code: `ERR_${response.statusText.toUpperCase().replace(' ', '_')}`,
                    response: {
                        data: data as E,
                        status: response.status,
                        statusText: response.statusText,
                        headers: Object.fromEntries(response.headers.entries()),
                    },
                    config: processedConfig
                }));
            }

            return await this.processResponse<R>({
                data: data as R,
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries()),
                config: processedConfig
            });
        };
    }
}
