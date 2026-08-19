import { HTTP_METHODS, HTTP_RESPONSE_TYPES } from '../constants';
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
    THttpResponseType
} from '../types';
import { buildUrl, hasHeader, mergeHeaders } from '../utilities';

function extractResponseHeaders(headers: Headers): THttpHeaders {
    const result: THttpHeaders = {};
    headers.forEach((value, key) => {
        result[key] = value;
    });
    return result;
}

async function parseResponseBody<T>(response: Response, responseType?: THttpResponseType): Promise<T> {
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
        case HTTP_RESPONSE_TYPES.JSON:
        default: {
            const text = await response.text();
            if (!text) {
                return undefined as T;
            }
            return JSON.parse(text) as T;
        }
    }
}

export class FetchAdapter implements IHttpClientAdapter {
    async request<T>(config: IHttpRequestConfig): Promise<IHttpResponse<T>> {
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

        const requestHeaders = mergeHeaders(headers);
        let body: BodyInit | undefined;

        if (data !== undefined && method !== HTTP_METHODS.GET && method !== HTTP_METHODS.HEAD) {
            if (typeof data === 'string' || data instanceof ArrayBuffer || data instanceof Blob) {
                body = data as BodyInit;
            } else {
                body = JSON.stringify(data);
                if (!hasHeader(requestHeaders, 'Content-Type')) {
                    requestHeaders['Content-Type'] = 'application/json';
                }
            }
        }

        let ownController: AbortController | undefined;
        let timeoutId: ReturnType<typeof setTimeout> | undefined;

        if (timeout) {
            ownController = new AbortController();
            timeoutId = setTimeout(() => ownController!.abort(), timeout);

            if (userSignal) {
                if (userSignal.aborted) {
                    clearTimeout(timeoutId);
                    throw new AbortError('Request was aborted');
                }
                userSignal.addEventListener('abort', () => ownController!.abort(), { once: true });
            }
        }

        const requestSignal = ownController?.signal ?? userSignal;

        try {
            const response = await fetch(fullUrl, {
                method,
                headers: requestHeaders,
                body,
                signal: requestSignal
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

                throw new HttpError(
                    `Request failed with status code ${response.status}`,
                    response.status as THttpStatusCode,
                    errorData
                );
            }

            const responseData = await parseResponseBody<T>(response, responseType);

            return {
                data: responseData,
                status: response.status as THttpStatusCode,
                statusText: response.statusText,
                headers: extractResponseHeaders(response.headers),
                config
            };
        } catch (error) {
            if (error instanceof HttpError) {
                throw error;
            }

            if (userSignal?.aborted) {
                throw new AbortError('Request was aborted');
            }

            if (timeout && error instanceof DOMException && error.name === 'AbortError') {
                throw new TimeoutError(`Request timed out after ${timeout}ms`);
            }

            throw new NetworkError((error as Error).message);
        } finally {
            if (timeoutId !== undefined) {
                clearTimeout(timeoutId);
            }
        }
    }
}
