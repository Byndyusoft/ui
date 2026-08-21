import { HTTP_METHODS, HTTP_RESPONSE_TYPES } from '../constants';
import { HttpClientError } from '../errors/HttpClientError';
import { HttpResponseError } from '../errors/HttpResponseError';
import { NetworkError } from '../errors/NetworkError';
import { ParseError } from '../errors/ParseError';
import { RequestPreparationError } from '../errors/RequestPreparationError';
import { TimeoutError } from '../errors/TimeoutError';
import { AbortError } from '../errors/AbortError';
import {
    IFetchAdapterOptions,
    IHttpClientAdapter,
    IHttpRequestConfig,
    IHttpResponse,
    THttpHeaders,
    THttpResponseType
} from '../types';
import { assertValidFetchAdapterOptions } from '../asserts';
import { buildUrl, getErrorMessage, mergeHeaders, prepareRequestBody } from '../utilities';

function extractResponseHeaders(headers: Headers): THttpHeaders {
    const result: THttpHeaders = {};
    headers.forEach((value, key) => {
        result[key] = value;
    });
    return result;
}

interface IPreparedFetchRequest {
    readonly fullUrl: string;
    readonly requestHeaders: THttpHeaders;
    readonly body: BodyInit | undefined;
    readonly signal: AbortSignal | undefined;
    readonly userSignal: AbortSignal | undefined;
    readonly timeout: number | undefined;
    cleanup(): void;
}

function prepareFetchRequest(config: IHttpRequestConfig): IPreparedFetchRequest {
    const { url, method, headers = {}, params, data, signal: userSignal, timeout, baseUrl: baseURL } = config;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let removeAbortListener: (() => void) | undefined;
    const cleanup = (): void => {
        if (timeoutId !== undefined) {
            clearTimeout(timeoutId);
        }

        removeAbortListener?.();
    };

    try {
        const fullUrl = buildUrl(baseURL, url, params);
        const requestHeaders = mergeHeaders(headers);
        const body =
            data !== undefined && method !== HTTP_METHODS.GET && method !== HTTP_METHODS.HEAD
                ? prepareRequestBody(data, requestHeaders)
                : undefined;

        if (timeout) {
            const controller = new AbortController();
            timeoutId = setTimeout(() => controller.abort(), timeout);

            if (userSignal) {
                if (userSignal.aborted) {
                    throw new AbortError('Request was aborted', { cause: userSignal.reason, config });
                }

                const abort = (): void => controller.abort();
                userSignal.addEventListener('abort', abort, { once: true });
                removeAbortListener = () => userSignal.removeEventListener('abort', abort);
            }

            return {
                fullUrl,
                requestHeaders,
                body,
                signal: controller.signal,
                userSignal,
                timeout,
                cleanup
            };
        }

        return {
            fullUrl,
            requestHeaders,
            body,
            signal: userSignal,
            userSignal,
            timeout,
            cleanup
        };
    } catch (error) {
        cleanup();
        throw error;
    }
}

function resolveCredentials(
    withCredentials: boolean | undefined,
    adapterCredentials: RequestCredentials | undefined
): RequestCredentials {
    if (withCredentials === true) {
        return 'include';
    }

    if (withCredentials === false) {
        return 'same-origin';
    }

    return adapterCredentials ?? 'same-origin';
}

async function parseResponseBody<T>(
    response: Response,
    config: IHttpRequestConfig,
    responseType?: THttpResponseType
): Promise<T> {
    if (response.status === 204 || response.headers.get('content-length') === '0') {
        return undefined as T;
    }

    switch (responseType) {
        case HTTP_RESPONSE_TYPES.TEXT:
            return response.text() as Promise<T>;
        case HTTP_RESPONSE_TYPES.BLOB:
            return response.blob() as Promise<T>;
        case HTTP_RESPONSE_TYPES.ARRAY_BUFFER:
            return response.arrayBuffer() as Promise<T>;
        case HTTP_RESPONSE_TYPES.FORM_DATA:
            try {
                return (await response.formData()) as T;
            } catch (error) {
                throw new ParseError('Failed to parse response body as FormData', {
                    cause: error,
                    config,
                    responseType: HTTP_RESPONSE_TYPES.FORM_DATA
                });
            }
        case HTTP_RESPONSE_TYPES.STREAM:
            if (response.body === null) {
                throw new ParseError('Streaming response body is not available', {
                    config,
                    responseType: HTTP_RESPONSE_TYPES.STREAM
                });
            }

            return response.body as T;
        case HTTP_RESPONSE_TYPES.JSON:
        default: {
            const resolvedResponseType = responseType ?? HTTP_RESPONSE_TYPES.JSON;
            const text = await response.text();
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

export class FetchAdapter implements IHttpClientAdapter {
    private readonly options: IFetchAdapterOptions;

    constructor(options: IFetchAdapterOptions = {}) {
        assertValidFetchAdapterOptions(options);

        this.options = { ...options };
    }

    async request<T>(config: IHttpRequestConfig): Promise<IHttpResponse<T>> {
        let request: IPreparedFetchRequest;

        try {
            request = prepareFetchRequest(config);
        } catch (error) {
            if (error instanceof HttpClientError) {
                throw error;
            }

            throw new RequestPreparationError('Failed to prepare HTTP request', { cause: error, config });
        }

        try {
            const response = await fetch(request.fullUrl, {
                ...this.options,
                method: config.method,
                headers: request.requestHeaders,
                body: request.body,
                credentials: resolveCredentials(config.withCredentials, this.options.credentials),
                signal: request.signal
            });

            if (!response.ok) {
                let errorData: unknown;
                try {
                    const text = await response.text();
                    try {
                        errorData = JSON.parse(text);
                    } catch {
                        errorData = text || undefined;
                    }
                } catch {
                    errorData = undefined;
                }

                throw new HttpResponseError(
                    `Request failed with status code ${response.status}`,
                    response.status,
                    response.statusText,
                    extractResponseHeaders(response.headers),
                    config,
                    errorData
                );
            }

            const responseData = await parseResponseBody<T>(response, config, config.responseType);

            return {
                data: responseData,
                status: response.status,
                statusText: response.statusText,
                headers: extractResponseHeaders(response.headers),
                config
            };
        } catch (error) {
            if (error instanceof HttpClientError) {
                throw error;
            }

            if (request.userSignal?.aborted) {
                throw new AbortError('Request was aborted', { cause: request.userSignal.reason ?? error, config });
            }

            if (request.timeout && error instanceof DOMException && error.name === 'AbortError') {
                throw new TimeoutError(`Request timed out after ${request.timeout}ms`, {
                    cause: error,
                    config,
                    timeout: request.timeout
                });
            }

            throw new NetworkError(getErrorMessage(error, 'Network request failed'), { cause: error, config });
        } finally {
            request.cleanup();
        }
    }
}
