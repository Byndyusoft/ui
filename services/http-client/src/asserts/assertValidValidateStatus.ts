import { REQUEST_BUILDER_ERROR_CODES } from '../constants';
import { RequestBuilderError } from '../errors';
import { TValidateStatus } from '../types';

/** Validates a custom HTTP response status predicate. */
export function assertValidValidateStatus(value: unknown): asserts value is TValidateStatus {
    if (typeof value !== 'function') {
        throw new RequestBuilderError(
            'validateStatus must be a function',
            REQUEST_BUILDER_ERROR_CODES.INVALID_VALIDATE_STATUS
        );
    }
}
