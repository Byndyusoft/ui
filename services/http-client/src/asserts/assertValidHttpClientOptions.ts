import { REQUEST_BUILDER_ERROR_CODES } from '../constants';
import { RequestBuilderError } from '../errors';
import { IHttpClientAdapter, IHttpClientOptions } from '../types';
import { assertValidBaseUrl } from './assertValidBaseUrl';
import { assertValidHeaders } from './assertValidHeaders';
import { assertValidParams } from './assertValidParams';
import { assertValidTimeout } from './assertValidTimeout';
import { isRecord } from './isRecord';

function assertValidAdapter(adapter: unknown): asserts adapter is IHttpClientAdapter {
    if (
        adapter === null ||
        (typeof adapter !== 'object' && typeof adapter !== 'function') ||
        typeof (adapter as IHttpClientAdapter).request !== 'function'
    ) {
        throw new RequestBuilderError(
            'Adapter must implement a request method',
            REQUEST_BUILDER_ERROR_CODES.INVALID_ADAPTER
        );
    }
}

function assertValidHook(hook: unknown, name: string): asserts hook is (...args: never[]) => unknown {
    if (typeof hook !== 'function') {
        throw new RequestBuilderError(`${name} must be a function`, REQUEST_BUILDER_ERROR_CODES.INVALID_HOOK);
    }
}

/** Validates options passed to the HTTP client constructor. */
export function assertValidHttpClientOptions(options: unknown): asserts options is IHttpClientOptions {
    if (!isRecord(options)) {
        throw new RequestBuilderError('Client options must be an object', REQUEST_BUILDER_ERROR_CODES.INVALID_CONFIG);
    }

    const { adapter, baseUrl, headers, params, timeout, onRequest, onRequestError, onResponse, onResponseError } =
        options;

    if (adapter !== undefined) {
        assertValidAdapter(adapter);
    }

    if (baseUrl !== undefined) {
        assertValidBaseUrl(baseUrl);
    }

    if (headers !== undefined) {
        assertValidHeaders(headers);
    }

    if (params !== undefined) {
        assertValidParams(params);
    }

    if (timeout !== undefined) {
        assertValidTimeout(timeout);
    }

    if (onRequest !== undefined) {
        assertValidHook(onRequest, 'onRequest');
    }

    if (onRequestError !== undefined) {
        assertValidHook(onRequestError, 'onRequestError');
    }

    if (onResponse !== undefined) {
        assertValidHook(onResponse, 'onResponse');
    }

    if (onResponseError !== undefined) {
        assertValidHook(onResponseError, 'onResponseError');
    }
}
