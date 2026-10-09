import { REQUEST_BUILDER_ERROR_CODES } from '../constants';
import { RequestBuilderError } from '../errors';
import { assertNonBlankString } from './assertNonBlankString';
import { HEADER_VALUE_LINE_BREAK_PATTERN } from './headerValueLineBreakPattern';

export function assertValidHeader(key: unknown, value: unknown): asserts value is string {
    assertNonBlankString(key, 'Header key must be a non-empty string', REQUEST_BUILDER_ERROR_CODES.INVALID_HEADER);

    if (!/^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/.test(key)) {
        throw new RequestBuilderError(
            'Header key contains invalid characters',
            REQUEST_BUILDER_ERROR_CODES.INVALID_HEADER
        );
    }

    if (typeof value !== 'string' || HEADER_VALUE_LINE_BREAK_PATTERN.test(value)) {
        throw new RequestBuilderError(
            'Header value must be a string without line breaks',
            REQUEST_BUILDER_ERROR_CODES.INVALID_HEADER
        );
    }
}
