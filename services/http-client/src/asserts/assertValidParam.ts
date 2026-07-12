import { REQUEST_BUILDER_ERROR_CODES } from '../constants';
import { RequestBuilderError } from '../errors';
import { THttpParamValue } from '../types';
import { assertNonBlankString } from './assertNonBlankString';

export function assertValidParam(key: unknown, value: unknown): asserts value is THttpParamValue {
    assertNonBlankString(key, 'Param key must be a non-empty string', REQUEST_BUILDER_ERROR_CODES.INVALID_PARAM);

    if (typeof value !== 'string' && !(Array.isArray(value) && value.every(item => typeof item === 'string'))) {
        throw new RequestBuilderError(
            'Param value must be a string or an array of strings',
            REQUEST_BUILDER_ERROR_CODES.INVALID_PARAM
        );
    }
}
