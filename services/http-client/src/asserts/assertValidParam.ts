import { REQUEST_BUILDER_ERROR_CODES } from '../constants';
import { RequestBuilderError } from '../errors';
import { THttpParamPrimitive, THttpParamValue } from '../types';
import { assertNonBlankString } from './assertNonBlankString';

function isValidParamPrimitive(value: unknown): value is THttpParamPrimitive {
    return (
        typeof value === 'string' || typeof value === 'boolean' || (typeof value === 'number' && Number.isFinite(value))
    );
}

function isValidParamValue(value: unknown): value is THttpParamValue {
    if (value === null || value === undefined || isValidParamPrimitive(value)) {
        return true;
    }

    return Array.isArray(value) && value.every(item => item === null || item === undefined || isValidParamPrimitive(item));
}

export function assertValidParam(key: unknown, value: unknown): asserts value is THttpParamValue {
    assertNonBlankString(key, 'Param key must be a non-empty string', REQUEST_BUILDER_ERROR_CODES.INVALID_PARAM);

    if (!isValidParamValue(value)) {
        throw new RequestBuilderError(
            'Param value must be a string, finite number, boolean, null, undefined, or an array of these values',
            REQUEST_BUILDER_ERROR_CODES.INVALID_PARAM
        );
    }
}
