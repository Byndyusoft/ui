import { REQUEST_BUILDER_ERROR_CODES } from '../constants';
import { RequestBuilderError } from '../errors';
import { THttpParamValue } from '../types';
import { assertNonBlankString } from './assertNonBlankString';

function isValidParamValue(value: unknown): value is string | number | boolean {
    return (
        typeof value === 'string' || typeof value === 'boolean' || (typeof value === 'number' && Number.isFinite(value))
    );
}

export function assertValidParam(key: unknown, value: unknown): asserts value is THttpParamValue {
    assertNonBlankString(key, 'Param key must be a non-empty string', REQUEST_BUILDER_ERROR_CODES.INVALID_PARAM);

    if (!isValidParamValue(value) && !(Array.isArray(value) && value.every(isValidParamValue))) {
        throw new RequestBuilderError(
            'Param value must be a string, finite number, boolean, or an array of these values',
            REQUEST_BUILDER_ERROR_CODES.INVALID_PARAM
        );
    }
}
