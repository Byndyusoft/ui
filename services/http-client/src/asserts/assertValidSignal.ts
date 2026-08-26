import { REQUEST_BUILDER_ERROR_CODES } from '../constants';
import { RequestBuilderError } from '../errors';

export function assertValidSignal(signal: unknown): asserts signal is AbortSignal {
    if (
        signal === null ||
        typeof signal !== 'object' ||
        typeof (signal as AbortSignal).aborted !== 'boolean' ||
        typeof (signal as AbortSignal).addEventListener !== 'function' ||
        typeof (signal as AbortSignal).removeEventListener !== 'function'
    ) {
        throw new RequestBuilderError('Signal must be an AbortSignal', REQUEST_BUILDER_ERROR_CODES.INVALID_SIGNAL);
    }
}
