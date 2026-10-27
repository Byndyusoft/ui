import { REQUEST_BUILDER_ERROR_CODES } from '../constants';
import { RequestBuilderError } from '../errors';
import { IFetchAdapterOptions } from '../types';
import { isRecord } from './isRecord';

const FETCH_CACHE_VALUES = ['default', 'no-store', 'reload', 'no-cache', 'force-cache', 'only-if-cached'];
const FETCH_CREDENTIALS_VALUES = ['omit', 'same-origin', 'include'];
const FETCH_MODE_VALUES = ['cors', 'no-cors', 'same-origin'];
const FETCH_REDIRECT_VALUES = ['error', 'follow', 'manual'];
const FETCH_REFERRER_POLICY_VALUES = [
    '',
    'no-referrer',
    'no-referrer-when-downgrade',
    'origin',
    'origin-when-cross-origin',
    'same-origin',
    'strict-origin',
    'strict-origin-when-cross-origin',
    'unsafe-url'
];

function throwInvalidOptions(message: string): never {
    throw new RequestBuilderError(message, REQUEST_BUILDER_ERROR_CODES.INVALID_FETCH_ADAPTER_OPTIONS);
}

function assertValidEnum(value: unknown, values: readonly string[], name: string): void {
    if (typeof value !== 'string' || !values.includes(value)) {
        throwInvalidOptions(`${name} must be a valid Fetch option`);
    }
}

function assertValidString(value: unknown, name: string): void {
    if (typeof value !== 'string') {
        throwInvalidOptions(`${name} must be a string`);
    }
}

/** Validates options passed to the Fetch adapter constructor. */
export function assertValidFetchAdapterOptions(options: unknown): asserts options is IFetchAdapterOptions {
    if (!isRecord(options)) {
        throwInvalidOptions('Fetch adapter options must be an object');
    }

    const { cache, credentials, integrity, keepalive, mode, redirect, referrer, referrerPolicy } = options;

    if (cache !== undefined) {
        assertValidEnum(cache, FETCH_CACHE_VALUES, 'cache');
    }

    if (credentials !== undefined) {
        assertValidEnum(credentials, FETCH_CREDENTIALS_VALUES, 'credentials');
    }

    if (integrity !== undefined) {
        assertValidString(integrity, 'integrity');
    }

    if (keepalive !== undefined && typeof keepalive !== 'boolean') {
        throwInvalidOptions('keepalive must be a boolean');
    }

    if (mode !== undefined) {
        assertValidEnum(mode, FETCH_MODE_VALUES, 'mode');
    }

    if (cache === 'only-if-cached' && mode !== 'same-origin') {
        throwInvalidOptions('cache "only-if-cached" requires mode "same-origin"');
    }

    if (redirect !== undefined) {
        assertValidEnum(redirect, FETCH_REDIRECT_VALUES, 'redirect');
    }

    if (referrer !== undefined) {
        assertValidString(referrer, 'referrer');
    }

    if (referrerPolicy !== undefined) {
        assertValidEnum(referrerPolicy, FETCH_REFERRER_POLICY_VALUES, 'referrerPolicy');
    }
}
