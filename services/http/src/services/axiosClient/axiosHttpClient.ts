import axios, { AxiosInstance } from 'axios';
import { HttpClient, IHttpClientInit, DEFAULT_REQUEST_TIMEOUT } from '../httpClient';
import { IRequestClientOptions } from '../httpRequest';

export class AxiosHttpClient extends HttpClient {
    requestClient;
    private axiosInstance: AxiosInstance;

    constructor({ baseURL, headers, timeout }: IHttpClientInit) {
        super();

        this.axiosInstance = axios.create({
            baseURL,
            headers,
            timeout: timeout ?? DEFAULT_REQUEST_TIMEOUT
        });

        this.requestClient = <R>(arg: IRequestClientOptions): Promise<R> =>
            this.axiosInstance({ url: arg.url, method: arg.method, headers: arg.headers, params: arg.params, data: arg.body })
                .then(response => response.data)
    }

    setHeader(key: string, value: string): void {
        this.axiosInstance.defaults.headers[key] = value;
    };
}
