import { IRequestClientOptions } from '../httpRequest';
import { DEFAULT_REQUEST_TIMEOUT, HttpClient, IHttpClientInit } from '../httpClient';
import { THeaders, IHttpClientResponse, HttpClientError } from '../../types/httpClient.types';

export class HttpClientFetch extends HttpClient {
    baseURL: string;
    headers: THeaders = {};
    timeout: number;
    requestClient;

    constructor({ baseURL, headers, timeout }: IHttpClientInit) {
        super();

        this.baseURL = baseURL;
        this.headers = Object.assign(this.headers, headers);
        this.timeout = timeout ?? DEFAULT_REQUEST_TIMEOUT;
        this.requestClient = async <R, E>(arg: IRequestClientOptions): Promise<IHttpClientResponse<R>> => {
            const url = encodeURI(`${this.baseURL}${arg.url}`) + HttpClient.buildQueryString(arg.params);
            const headers = Object.assign(this.headers, arg.headers);

            const response = await fetch(url, { method: arg.method, headers, body: JSON.stringify(arg.body) });

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

    setHeader(key: string, value: string): void {
        this.headers[key] = value;
    }
}
