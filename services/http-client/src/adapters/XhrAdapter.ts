import { HTTP_METHODS } from '../constants';
import { HttpError } from '../errors/HttpError';
import { NetworkError } from '../errors/NetworkError';
import { TimeoutError } from '../errors/TimeoutError';
import { AbortError } from '../errors/AbortError';
import {
    IHttpClientAdapter,
    IHttpRequestConfig,
    IHttpResponse,
    THttpStatusCode,
    THttpHeaders,
    THttpParams,
    THttpResponseType
} from '../types';

function buildUrl(baseURL: string | undefined, url: string, params?: THttpParams): string {
    let fullUrl = baseURL ? `${baseURL}${url}` : url;

    if (params && Object.keys(params).length > 0) {
        const searchParams = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
            const values = Array.isArray(value) ? value : [value];
            for (const v of values) {
                searchParams.append(key, v);
            }
        }
        const separator = fullUrl.includes('?') ? '&' : '?';
        fullUrl += separator + searchParams.toString();
    }

    return fullUrl;
}

function parseResponseHeaders(rawHeaders: string): THttpHeaders {
    const result: THttpHeaders = {};
    const lines = rawHeaders.trim().split('\r\n');
    for (const line of lines) {
        const index = line.indexOf(': ');
        if (index > 0) {
            const key = line.slice(0, index).toLowerCase();
            const value = line.slice(index + 2);
            result[key] = value;
        }
    }
    return result;
}

function getResponseBody(xhr: XMLHttpRequest, responseType?: THttpResponseType): unknown {
    if (xhr.status === 204) {
        return undefined;
    }

    switch (responseType) {
        case 'arraybuffer':
        case 'blob':
            return xhr.response;
        case 'text':
            return xhr.response;
        case 'json':
        default: {
            const text = xhr.response as string;
            if (!text) {
                return undefined;
            }
            return JSON.parse(text);
        }
    }
}

export class XhrAdapter implements IHttpClientAdapter {
    request<T>(config: IHttpRequestConfig): Promise<IHttpResponse<T>> {
        const {
            url,
            method,
            headers = {},
            params,
            data,
            signal: userSignal,
            timeout,
            responseType,
            baseUrl: baseURL
        } = config;

        const fullUrl = buildUrl(baseURL ?? undefined, url, params);

        return new Promise<IHttpResponse<T>>((resolve, reject) => {
            if (userSignal?.aborted) {
                reject(new AbortError('Request was aborted'));
                return;
            }

            const xhr = new XMLHttpRequest();
            xhr.open(method, fullUrl, true);

            if (timeout !== undefined && timeout > 0) {
                xhr.timeout = timeout;
            }

            if (responseType === 'arraybuffer') {
                xhr.responseType = 'arraybuffer';
            } else if (responseType === 'blob') {
                xhr.responseType = 'blob';
            } else {
                xhr.responseType = 'text';
            }

            const requestHeaders: THttpHeaders = { ...headers };
            if (data !== undefined && method !== HTTP_METHODS.GET && method !== HTTP_METHODS.HEAD) {
                if (typeof data !== 'string' && !(data instanceof ArrayBuffer) && !(data instanceof Blob)) {
                    if (!requestHeaders['Content-Type']) {
                        requestHeaders['Content-Type'] = 'application/json';
                    }
                }
            }
            for (const [key, value] of Object.entries(requestHeaders)) {
                xhr.setRequestHeader(key, value);
            }

            let body: string | ArrayBuffer | Blob | undefined;
            if (data !== undefined && method !== HTTP_METHODS.GET && method !== HTTP_METHODS.HEAD) {
                if (typeof data === 'string' || data instanceof ArrayBuffer || data instanceof Blob) {
                    body = data;
                } else {
                    body = JSON.stringify(data);
                }
            }

            const onAbort = (): void => xhr.abort();
            if (userSignal) {
                userSignal.addEventListener('abort', onAbort, { once: true });
            }

            const cleanup = (): void => {
                if (userSignal) {
                    userSignal.removeEventListener('abort', onAbort);
                }
            };

            xhr.onload = () => {
                cleanup();

                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const responseData = getResponseBody(xhr, responseType) as T;
                        resolve({
                            data: responseData,
                            status: xhr.status as THttpStatusCode,
                            statusText: xhr.statusText,
                            headers: parseResponseHeaders(xhr.getAllResponseHeaders()),
                            config
                        });
                    } catch (error) {
                        reject(new NetworkError((error as Error).message));
                    }
                } else {
                    let errorData: unknown;
                    try {
                        if (xhr.responseType === 'text') {
                            const text = xhr.responseText;
                            if (text) {
                                try {
                                    errorData = JSON.parse(text);
                                } catch {
                                    errorData = text;
                                }
                            }
                        }
                    } catch {
                        errorData = undefined;
                    }

                    reject(
                        new HttpError(
                            `Request failed with status code ${xhr.status}`,
                            xhr.status as THttpStatusCode,
                            errorData
                        )
                    );
                }
            };

            xhr.onerror = () => {
                cleanup();
                reject(new NetworkError('Network request failed'));
            };

            xhr.onabort = () => {
                cleanup();
                reject(new AbortError('Request was aborted'));
            };

            xhr.ontimeout = () => {
                cleanup();
                reject(new TimeoutError(`Request timed out after ${timeout}ms`));
            };

            xhr.send(body);
        });
    }
}
