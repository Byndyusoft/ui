import { REQUEST_BUILDER_ERROR_CODES } from '../constants';
import { RequestBuilderError } from '../errors';

export function assertValidTimeout(timeout: unknown): asserts timeout is number {
    if (typeof timeout !== 'number' || !Number.isFinite(timeout) || timeout < 0) {
        throw new RequestBuilderError(
            'Timeout must be a finite non-negative number',
            REQUEST_BUILDER_ERROR_CODES.INVALID_TIMEOUT
        );
    }
}
