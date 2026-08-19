import { HTTP_METHODS, HTTP_RESPONSE_TYPES } from '../constants';
import { HttpClientError } from '../errors/HttpClientError';
import { HttpResponseError } from '../errors/HttpResponseError';
import { NetworkError } from '../errors/NetworkError';
import { ParseError } from '../errors/ParseError';
import { TimeoutError } from '../errors/TimeoutError';
import { AbortError } from '../errors/AbortError';
import { IHttpClientAdapter, IHttpRequestConfig, IHttpResponse, THttpHeaders, THttpResponseType } from '../types';
import { buildUrl, getErrorMessage, hasHeader, mergeHeaders } from '../utilities';

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

interface IXhrResponseStream {
    readonly data: ReadableStream<Uint8Array>;
    append(): void;
    close(): void;
    error(reason: unknown): void;
}

function createResponseStream(xhr: XMLHttpRequest): IXhrResponseStream {
    let controller: ReadableStreamDefaultController<Uint8Array> | undefined;
    let textLength = 0;
    const encoder = new TextEncoder();

    const data = new ReadableStream<Uint8Array>({
        start(value) {
            controller = value;
        }
    });

    return {
        data,
        append() {
            const text = xhr.responseText;
            const chunk = text.slice(textLength);

            if (chunk) {
                controller?.enqueue(encoder.encode(chunk));
                textLength = text.length;
            }
        },
        close() {
            controller?.close();
        },
        error(reason) {
            controller?.error(reason);
        }
    };
}

async function readBlob(blob: Blob): Promise<ArrayBuffer> {
    if (typeof blob.arrayBuffer === 'function') {
        return blob.arrayBuffer();
    }

    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            if (typeof reader.result === 'string' || reader.result === null) {
                reject(new TypeError('Failed to read response Blob as an ArrayBuffer'));
                return;
            }

            resolve(reader.result);
        };
        reader.onerror = () => {
            reject(reader.error ?? new TypeError('Failed to read response Blob as an ArrayBuffer'));
        };
        reader.readAsArrayBuffer(blob);
    });
}

async function getResponseBody<T>(
    xhr: XMLHttpRequest,
    config: IHttpRequestConfig,
    responseType?: THttpResponseType
): Promise<T> {
    if (xhr.status === 204) {
        return undefined as T;
    }

    switch (responseType) {
        case HTTP_RESPONSE_TYPES.ARRAY_BUFFER:
        case HTTP_RESPONSE_TYPES.BLOB:
            return xhr.response as T;
        case HTTP_RESPONSE_TYPES.TEXT:
            return xhr.response as T;
        case HTTP_RESPONSE_TYPES.FORM_DATA:
            try {
                const body = xhr.response as Blob;
                const response = new Response(await readBlob(body), {
                    headers: parseResponseHeaders(xhr.getAllResponseHeaders())
                });

                return (await response.formData()) as T;
            } catch (error) {
                throw new ParseError('Failed to parse response body as FormData', { cause: error, config });
            }
        case HTTP_RESPONSE_TYPES.JSON:
        default: {
            const text = xhr.response as string;
            if (!text) {
                return undefined as T;
            }
            try {
                return JSON.parse(text) as T;
            } catch (error) {
                throw new ParseError('Failed to parse response body as JSON', { cause: error, config });
            }
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

        const fullUrl = buildUrl(baseURL, url, params);

        return new Promise<IHttpResponse<T>>((resolve, reject) => {
            if (userSignal?.aborted) {
                reject(new AbortError('Request was aborted', { cause: userSignal.reason, config }));
                return;
            }

            if (responseType === HTTP_RESPONSE_TYPES.STREAM && typeof ReadableStream === 'undefined') {
                reject(new ParseError('Streaming responses are not supported in this environment', { config }));
                return;
            }

            const xhr = new XMLHttpRequest();
            xhr.open(method, fullUrl, true);

            if (timeout !== undefined && timeout > 0) {
                xhr.timeout = timeout;
            }

            if (responseType === HTTP_RESPONSE_TYPES.ARRAY_BUFFER) {
                // XHR принимает только DOM-значение в нижнем регистре
                xhr.responseType = 'arraybuffer';
            } else if (responseType === HTTP_RESPONSE_TYPES.BLOB || responseType === HTTP_RESPONSE_TYPES.FORM_DATA) {
                xhr.responseType = 'blob';
            } else {
                xhr.responseType = 'text';
            }

            const requestHeaders = mergeHeaders(headers);
            if (data !== undefined && method !== HTTP_METHODS.GET && method !== HTTP_METHODS.HEAD) {
                if (typeof data !== 'string' && !(data instanceof ArrayBuffer) && !(data instanceof Blob)) {
                    if (!hasHeader(requestHeaders, 'Content-Type')) {
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

            let responseStream: IXhrResponseStream | undefined;
            let streamResponseResolved = false;
            const isSuccessful = (): boolean => xhr.status >= 200 && xhr.status < 300;
            const resolveStream = (): void => {
                if (streamResponseResolved || !isSuccessful()) {
                    return;
                }

                responseStream = createResponseStream(xhr);
                streamResponseResolved = true;
                resolve({
                    data: responseStream.data as T,
                    status: xhr.status,
                    statusText: xhr.statusText,
                    headers: parseResponseHeaders(xhr.getAllResponseHeaders()),
                    config
                });
            };

            if (responseType === HTTP_RESPONSE_TYPES.STREAM) {
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === XMLHttpRequest.HEADERS_RECEIVED) {
                        resolveStream();
                    }
                };

                xhr.onprogress = () => {
                    responseStream?.append();
                };
            }

            const rejectOrFailStream = (error: HttpClientError): void => {
                cleanup();

                if (streamResponseResolved) {
                    responseStream?.error(error);
                    return;
                }

                reject(error);
            };

            xhr.onload = async () => {
                cleanup();

                if (isSuccessful()) {
                    if (responseType === HTTP_RESPONSE_TYPES.STREAM) {
                        resolveStream();
                        responseStream?.append();
                        responseStream?.close();

                        return;
                    }

                    try {
                        const responseData = await getResponseBody<T>(xhr, config, responseType);

                        resolve({
                            data: responseData,
                            status: xhr.status,
                            statusText: xhr.statusText,
                            headers: parseResponseHeaders(xhr.getAllResponseHeaders()),
                            config
                        });
                    } catch (error) {
                        reject(
                            error instanceof HttpClientError
                                ? error
                                : new NetworkError(getErrorMessage(error, 'Network request failed'), {
                                      cause: error,
                                      config
                                  })
                        );
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
                        new HttpResponseError(
                            `Request failed with status code ${xhr.status}`,
                            xhr.status,
                            xhr.statusText,
                            parseResponseHeaders(xhr.getAllResponseHeaders()),
                            config,
                            errorData
                        )
                    );
                }
            };

            xhr.onerror = event => {
                rejectOrFailStream(new NetworkError('Network request failed', { cause: event, config }));
            };

            xhr.onabort = event => {
                rejectOrFailStream(
                    new AbortError('Request was aborted', { cause: userSignal?.reason ?? event, config })
                );
            };

            xhr.ontimeout = event => {
                rejectOrFailStream(
                    new TimeoutError(`Request timed out after ${timeout ?? 0}ms`, { cause: event, config })
                );
            };

            xhr.send(body);
        });
    }
}
