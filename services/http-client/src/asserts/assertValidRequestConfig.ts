import { REQUEST_BUILDER_ERROR_CODES } from '../constants';
import { RequestBuilderError } from '../errors';
import { IHttpRequestConfig } from '../types';
import { assertBodyAllowed } from './assertBodyAllowed';
import { assertValidBaseUrl } from './assertValidBaseUrl';
import { assertValidHeaders } from './assertValidHeaders';
import { assertValidMethod } from './assertValidMethod';
import { assertValidParams } from './assertValidParams';
import { assertValidResponseType } from './assertValidResponseType';
import { assertValidSignal } from './assertValidSignal';
import { assertValidTimeout } from './assertValidTimeout';
import { assertValidUrl } from './assertValidUrl';
import { assertValidWithCredentials } from './assertValidWithCredentials';
import { isRecord } from './isRecord';

/** Validates a complete request config, including values returned by request hooks. */
export function assertValidRequestConfig(config: unknown): asserts config is IHttpRequestConfig {
    if (!isRecord(config)) {
        throw new RequestBuilderError('Request config must be an object', REQUEST_BUILDER_ERROR_CODES.INVALID_CONFIG);
    }

    const { method, url, baseUrl, headers, params, signal, timeout, withCredentials, responseType } = config;

    assertValidMethod(method);
    assertValidUrl(url);

    if (baseUrl !== undefined) {
        assertValidBaseUrl(baseUrl);
    }

    if (headers !== undefined) {
        assertValidHeaders(headers);
    }

    if (params !== undefined) {
        assertValidParams(params);
    }

    if (signal !== undefined) {
        assertValidSignal(signal);
    }

    if (timeout !== undefined) {
        assertValidTimeout(timeout);
    }

    if (withCredentials !== undefined) {
        assertValidWithCredentials(withCredentials);
    }

    if (responseType !== undefined) {
        assertValidResponseType(responseType);
    }

    if (Object.prototype.hasOwnProperty.call(config, 'data')) {
        assertBodyAllowed(method);
    }
}
