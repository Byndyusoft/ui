import { RequestBuilderError } from '../errors';
import { TRequestBuilderErrorCode } from '../types';

export function assertNonBlankString(
    value: unknown,
    message: string,
    code: TRequestBuilderErrorCode
): asserts value is string {
    if (typeof value !== 'string' || value.trim().length === 0) {
        throw new RequestBuilderError(message, code);
    }
}
