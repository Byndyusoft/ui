import { REQUEST_BUILDER_ERROR_CODES } from '../constants';
import { RequestBuilderError } from '../errors';
import { IXhrAdapterOptions } from '../types';
import { assertValidResponseType } from './assertValidResponseType';
import { assertValidTimeout } from './assertValidTimeout';
import { assertValidWithCredentials } from './assertValidWithCredentials';
import { isRecord } from './isRecord';

function throwInvalidOptions(message: string): never {
    throw new RequestBuilderError(message, REQUEST_BUILDER_ERROR_CODES.INVALID_XHR_ADAPTER_OPTIONS);
}

/** Validates options passed to the XMLHttpRequest adapter constructor. */
export function assertValidXhrAdapterOptions(options: unknown): asserts options is IXhrAdapterOptions {
    if (!isRecord(options)) {
        throwInvalidOptions('XHR adapter options must be an object');
    }

    const { mimeType, responseType, timeout, withCredentials, onDownloadProgress, onUploadProgress } = options;

    if (mimeType !== undefined && (typeof mimeType !== 'string' || mimeType.trim().length === 0)) {
        throwInvalidOptions('mimeType must be a non-empty string');
    }

    if (responseType !== undefined) {
        assertValidResponseType(responseType);
    }

    if (timeout !== undefined) {
        assertValidTimeout(timeout);
    }

    if (withCredentials !== undefined) {
        assertValidWithCredentials(withCredentials);
    }

    if (onDownloadProgress !== undefined && typeof onDownloadProgress !== 'function') {
        throwInvalidOptions('onDownloadProgress must be a function');
    }

    if (onUploadProgress !== undefined && typeof onUploadProgress !== 'function') {
        throwInvalidOptions('onUploadProgress must be a function');
    }
}
