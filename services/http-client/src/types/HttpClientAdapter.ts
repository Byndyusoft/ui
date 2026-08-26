import { IHttpRequestConfig } from './HttpRequestConfig';
import { IHttpResponse } from './HttpResponse';

export interface IHttpClientAdapter {
    request<T>(config: IHttpRequestConfig): Promise<IHttpResponse<T>>;
}
