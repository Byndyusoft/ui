import { REQUEST_BUILDER_ERROR_CODES } from '../constants';
import { RequestBuilderError } from '../errors';
import { IHttpClientAdapter } from '../types';

/** Validates an HTTP client adapter. */
export function assertValidAdapter(adapter: unknown): asserts adapter is IHttpClientAdapter {
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
