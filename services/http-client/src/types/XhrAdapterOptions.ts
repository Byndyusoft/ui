import { THttpResponseType } from './HttpResponseType';
import { IHttpRequestConfig } from './HttpRequestConfig';

/** Settings that are supported only by the XMLHttpRequest transport. */
export interface IXhrAdapterOptions {
    mimeType?: string;
    responseType?: THttpResponseType;
    timeout?: number;
    withCredentials?: boolean;
    onDownloadProgress?: (event: ProgressEvent, config: Readonly<IHttpRequestConfig>) => void;
    onUploadProgress?: (event: ProgressEvent, config: Readonly<IHttpRequestConfig>) => void;
}
