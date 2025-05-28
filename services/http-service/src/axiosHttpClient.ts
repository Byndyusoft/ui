import axios, { AxiosInstance } from 'axios';
import { HttpClient, IHttpClientInit, DEFAULT_REQUEST_TIMEOUT } from './httpClient.types';
import { IRequestClientOptions } from './httpRequest';

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

        this.requestClient = function<R>(arg: IRequestClientOptions): Promise<R> {
            return this.axiosInstance({ url: arg.url, method: arg.method, headers: arg.headers, params: arg.params, data: arg.body });
        };
    }

    setHeader(key: string, value: string): void {
        this.axiosInstance.defaults.headers[key] = value;
    };
}

const test = new AxiosHttpClient({ baseURL: 'http://localhost:3000/' });

const request = test.post<{ test: 'test'}>().url('helo').body({ mama: 'me' }).send();