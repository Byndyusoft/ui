import { HttpRequest, HttpRequestWithBody, IRequestClientOptions, IHeaders } from './httpRequest';

export const DEFAULT_REQUEST_TIMEOUT = 60000;

export interface IHttpClientInit {
    baseURL: string;
    headers?: IHeaders;
    timeout?: number;
}

// TODO: добавить абстрактный класс вместо интерфейса со статичными методами?

export interface IHttpClient {
    requestClient<R>(arg: IRequestClientOptions): Promise<R>;
    setHeader(key: string, value: string): void;
    get<R>(): HttpRequest<R>;
    post<R>(): HttpRequestWithBody<R>;
    put<R>(): HttpRequestWithBody<R>;
    patch<R>(): HttpRequestWithBody<R>;
    delete<R>(): HttpRequest<R>;
}
