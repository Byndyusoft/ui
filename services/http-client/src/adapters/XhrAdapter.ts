import { HTTP_METHODS, HTTP_RESPONSE_TYPES } from '../constants';
import { HttpClientError } from '../errors/HttpClientError';
import { HttpResponseError } from '../errors/HttpResponseError';
import { NetworkError } from '../errors/NetworkError';
import { ParseError } from '../errors/ParseError';
import { RequestPreparationError } from '../errors/RequestPreparationError';
import { TimeoutError } from '../errors/TimeoutError';
import { AbortError } from '../errors/AbortError';
import {
    IHttpClientAdapter,
    IHttpRequestConfig,
    IHttpResponse,
    IXhrAdapterOptions,
    THttpHeaders,
    THttpResponseType
} from '../types';
import { assertValidXhrAdapterOptions } from '../asserts';
import { buildUrl, getErrorMessage, mergeHeaders, prepareRequestBody } from '../utilities';

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
                throw new ParseError('Failed to parse response body as FormData', {
                    cause: error,
                    config,
                    responseType: HTTP_RESPONSE_TYPES.FORM_DATA
                });
            }
        case HTTP_RESPONSE_TYPES.JSON:
        default: {
            const resolvedResponseType = responseType ?? HTTP_RESPONSE_TYPES.JSON;
            const text = xhr.response as string;
            if (!text) {
                return undefined as T;
            }
            try {
                return JSON.parse(text) as T;
            } catch (error) {
                throw new ParseError('Failed to parse response body as JSON', {
                    cause: error,
                    config,
                    responseType: resolvedResponseType,
                    raw: text
                });
            }
        }
    }
}

interface IPreparedXhrRequest {
    readonly xhr: XMLHttpRequest;
    readonly body: ReturnType<typeof prepareRequestBody> | undefined;
    cleanup(): void;
}

function setResponseType(xhr: XMLHttpRequest, responseType: THttpResponseType | undefined): void {
    if (responseType === HTTP_RESPONSE_TYPES.ARRAY_BUFFER) {
        // XHR принимает только DOM-значение в нижнем регистре
        xhr.responseType = 'arraybuffer';
    } else if (responseType === HTTP_RESPONSE_TYPES.BLOB || responseType === HTTP_RESPONSE_TYPES.FORM_DATA) {
        xhr.responseType = 'blob';
    } else {
        xhr.responseType = 'text';
    }
}

function assertStreamingSupported(responseType: THttpResponseType | undefined, config: IHttpRequestConfig): void {
    if (
        responseType === HTTP_RESPONSE_TYPES.STREAM &&
        (typeof ReadableStream === 'undefined' || typeof TextEncoder === 'undefined')
    ) {
        throw new RequestPreparationError('Streaming responses are not supported in this environment', { config });
    }
}

function createResponse<T>(xhr: XMLHttpRequest, config: IHttpRequestConfig, data: T): IHttpResponse<T> {
    return {
        data,
        status: xhr.status,
        statusText: xhr.statusText,
        headers: parseResponseHeaders(xhr.getAllResponseHeaders()),
        config
    };
}

function getErrorData(xhr: XMLHttpRequest): unknown {
    try {
        if (xhr.responseType !== 'text') {
            return undefined;
        }

        const text = xhr.responseText;
        if (!text) {
            return undefined;
        }

        try {
            return JSON.parse(text);
        } catch {
            return text;
        }
    } catch {
        return undefined;
    }
}

function createResponseError(xhr: XMLHttpRequest, config: IHttpRequestConfig): HttpResponseError {
    return new HttpResponseError(
        `Request failed with status code ${xhr.status}`,
        xhr.status,
        xhr.statusText,
        parseResponseHeaders(xhr.getAllResponseHeaders()),
        config,
        getErrorData(xhr)
    );
}

function resolveRequestConfig(config: IHttpRequestConfig, options: IXhrAdapterOptions): IHttpRequestConfig {
    return {
        ...config,
        ...(config.responseType === undefined && options.responseType !== undefined
            ? { responseType: options.responseType }
            : {}),
        ...(config.timeout === undefined && options.timeout !== undefined ? { timeout: options.timeout } : {}),
        ...(config.withCredentials === undefined && options.withCredentials !== undefined
            ? { withCredentials: options.withCredentials }
            : {})
    };
}

function prepareXhrRequest(config: IHttpRequestConfig, options: IXhrAdapterOptions): IPreparedXhrRequest {
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

    if (userSignal?.aborted) {
        throw new AbortError('Request was aborted', { cause: userSignal.reason, config });
    }

    assertStreamingSupported(responseType, config);

    const xhr = new XMLHttpRequest();
    xhr.open(method, fullUrl, true);
    xhr.withCredentials = config.withCredentials === true;

    if (options.mimeType !== undefined) {
        xhr.overrideMimeType(options.mimeType);
    }

    if (timeout !== undefined && timeout > 0) {
        xhr.timeout = timeout;
    }

    setResponseType(xhr, responseType);

    const requestHeaders = mergeHeaders(headers);
    const body =
        data !== undefined && method !== HTTP_METHODS.GET && method !== HTTP_METHODS.HEAD
            ? prepareRequestBody(data, requestHeaders)
            : undefined;
    for (const [key, value] of Object.entries(requestHeaders)) {
        xhr.setRequestHeader(key, value);
    }

    const onAbort = (): void => xhr.abort();
    userSignal?.addEventListener('abort', onAbort, { once: true });

    return {
        xhr,
        body,
        cleanup() {
            userSignal?.removeEventListener('abort', onAbort);
        }
    };
}

function configureXhrEventHandlers<T>(
    request: IPreparedXhrRequest,
    config: IHttpRequestConfig,
    resolve: (value: IHttpResponse<T> | PromiseLike<IHttpResponse<T>>) => void,
    reject: (reason?: unknown) => void
): void {
    const { xhr } = request;
    const { signal: userSignal, timeout, responseType } = config;
    let responseStream: IXhrResponseStream | undefined;
    let streamResponseResolved = false;
    const isSuccessful = (): boolean => xhr.status >= 200 && xhr.status < 300;
    const resolveStream = (): void => {
        if (streamResponseResolved || !isSuccessful()) {
            return;
        }

        responseStream = createResponseStream(xhr);
        streamResponseResolved = true;
        resolve(createResponse(xhr, config, responseStream.data as T));
    };
    const rejectOrFailStream = (error: HttpClientError): void => {
        request.cleanup();

        if (streamResponseResolved) {
            responseStream?.error(error);
            return;
        }

        reject(error);
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

    xhr.onload = async () => {
        request.cleanup();

        if (!isSuccessful()) {
            reject(createResponseError(xhr, config));
            return;
        }

        if (responseType === HTTP_RESPONSE_TYPES.STREAM) {
            resolveStream();
            responseStream?.append();
            responseStream?.close();

            return;
        }

        try {
            const responseData = await getResponseBody<T>(xhr, config, responseType);
            resolve(createResponse(xhr, config, responseData));
        } catch (error) {
            reject(
                error instanceof HttpClientError
                    ? error
                    : new NetworkError(getErrorMessage(error, 'Network request failed'), { cause: error, config })
            );
        }
    };

    xhr.onerror = event => {
        rejectOrFailStream(new NetworkError('Network request failed', { cause: event, config }));
    };

    xhr.onabort = event => {
        rejectOrFailStream(new AbortError('Request was aborted', { cause: userSignal?.reason ?? event, config }));
    };

    xhr.ontimeout = event => {
        const timeoutMs = timeout ?? 0;

        rejectOrFailStream(
            new TimeoutError(`Request timed out after ${timeoutMs}ms`, {
                cause: event,
                config,
                timeout: timeoutMs
            })
        );
    };
}

export class XhrAdapter implements IHttpClientAdapter {
    private readonly options: IXhrAdapterOptions;

    constructor(options: IXhrAdapterOptions = {}) {
        assertValidXhrAdapterOptions(options);

        this.options = { ...options };
    }

    request<T>(config: IHttpRequestConfig): Promise<IHttpResponse<T>> {
        const resolvedConfig = resolveRequestConfig(config, this.options);

        return new Promise<IHttpResponse<T>>((resolve, reject) => {
            let request: IPreparedXhrRequest | undefined;

            try {
                request = prepareXhrRequest(resolvedConfig, this.options);
                configureXhrEventHandlers(request, resolvedConfig, resolve, reject);
                request.xhr.send(request.body);
            } catch (error) {
                request?.cleanup();
                reject(
                    error instanceof HttpClientError
                        ? error
                        : new RequestPreparationError('Failed to prepare HTTP request', {
                              cause: error,
                              config: resolvedConfig
                          })
                );
            }
        });
    }
}
