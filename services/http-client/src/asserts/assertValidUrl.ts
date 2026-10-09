import { REQUEST_BUILDER_ERROR_CODES } from '../constants';
import { assertNonBlankString } from './assertNonBlankString';

export function assertValidUrl(url: unknown): asserts url is string {
    assertNonBlankString(url, 'URL must be a non-empty string', REQUEST_BUILDER_ERROR_CODES.INVALID_URL);
}
