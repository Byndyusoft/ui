import { IHeaders, IRequestClientOptions } from '../httpRequest';
import { DEFAULT_REQUEST_TIMEOUT, HttpClient, IHttpClientInit } from '../httpClient';

export class FetchHttpClient extends HttpClient {
    baseURL: string;
    headers: IHeaders = {};
    timeout: number;
    requestClient;

    constructor({ baseURL, headers, timeout }: IHttpClientInit) {
        super();

        this.baseURL = baseURL;
        this.headers = Object.assign(this.headers, headers);
        this.timeout = timeout ?? DEFAULT_REQUEST_TIMEOUT;
        this.requestClient = function<R>(arg: IRequestClientOptions): Promise<R> {
            const url = encodeURI(`${this.baseURL}${arg.url}`) + HttpClient.buildQueryString(arg.params);
            const headers = Object.assign(this.headers, arg.headers);

            return fetch(url, { method: arg.method, headers, body: JSON.stringify(arg.body) })
                .then(response => response.json()) as Promise<R>;
        };
    }

    setHeader(key: string, value: string): void {
        this.headers[key] = value;
    }
}
