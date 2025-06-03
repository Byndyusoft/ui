import { IRequestClientOptions } from '../httpRequest';
import { DEFAULT_REQUEST_TIMEOUT, HttpClient, IHttpClientInit } from '../httpClient';
import { THeaders, IHttpClientResponse } from '../../types/httpClient.types';

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
        this.requestClient = async <R>(arg: IRequestClientOptions): Promise<IHttpClientResponse<R>> => {
            const url = encodeURI(`${this.baseURL}${arg.url}`) + HttpClient.buildQueryString(arg.params);
            const headers = Object.assign(this.headers, arg.headers);

            const response = await fetch(url, { method: arg.method, headers, body: JSON.stringify(arg.body) });

            if (!response.ok) {
                throw new Error(`HTTP error! Code: ${response.status}`);
            }

            const contentType = response.headers.get('Content-Type');

            let data: R;

            if (contentType?.includes('application/json')) {
                data = await response.json();
            } else if (contentType?.includes('text/')) {
                data = (await response.text()) as unknown as R;
            } else {
                data = (await response.blob()) as unknown as R;
            }

            return {
                data,
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
