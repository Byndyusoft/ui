import { THttpResponseType } from './HttpResponseType';

/** Settings that are supported only by the XMLHttpRequest transport. */
export interface IXhrAdapterOptions {
    mimeType?: string;
    responseType?: THttpResponseType;
    timeout?: number;
    withCredentials?: boolean;
}
