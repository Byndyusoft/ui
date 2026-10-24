import { IHttpRequestConfig } from './HttpRequestConfig';
import { IHttpResponse } from './HttpResponse';

export type THttpRequestExecutor = <T>(config: IHttpRequestConfig) => Promise<IHttpResponse<T>>;
