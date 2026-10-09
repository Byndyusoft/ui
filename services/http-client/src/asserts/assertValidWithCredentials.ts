import { REQUEST_BUILDER_ERROR_CODES } from '../constants';
import { RequestBuilderError } from '../errors';

export function assertValidWithCredentials(withCredentials: unknown): asserts withCredentials is boolean {
    if (typeof withCredentials !== 'boolean') {
        throw new RequestBuilderError(
            'withCredentials must be a boolean',
            REQUEST_BUILDER_ERROR_CODES.INVALID_WITH_CREDENTIALS
        );
    }
}
