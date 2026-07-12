import { REQUEST_BUILDER_ERROR_CODES } from '../constants';
import { assertNonBlankString } from './assertNonBlankString';

export function assertValidBaseUrl(baseUrl: unknown): asserts baseUrl is string {
    assertNonBlankString(baseUrl, 'Base URL must be a non-empty string', REQUEST_BUILDER_ERROR_CODES.INVALID_BASE_URL);
}
