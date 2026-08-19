import { THttpHeaders, THttpRequestBody } from '../types';
import { hasHeader } from './mergeHeaders';

function hasTag(value: unknown, tag: string): boolean {
    return Object.prototype.toString.call(value) === tag;
}

function isRequestBody(value: unknown): value is THttpRequestBody {
    return (
        typeof value === 'string' ||
        ArrayBuffer.isView(value) ||
        hasTag(value, '[object ArrayBuffer]') ||
        hasTag(value, '[object Blob]') ||
        hasTag(value, '[object FormData]') ||
        hasTag(value, '[object URLSearchParams]')
    );
}

function isUrlSearchParams(value: THttpRequestBody): value is URLSearchParams {
    return hasTag(value, '[object URLSearchParams]');
}

export function prepareRequestBody(data: unknown, headers: THttpHeaders): THttpRequestBody {
    if (isRequestBody(data)) {
        if (isUrlSearchParams(data) && !hasHeader(headers, 'Content-Type')) {
            headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
        }

        return isUrlSearchParams(data) ? data.toString() : data;
    }

    if (!hasHeader(headers, 'Content-Type')) {
        headers['Content-Type'] = 'application/json';
    }

    const body: unknown = JSON.stringify(data);
    if (typeof body !== 'string') {
        throw new TypeError('Request body cannot be serialized as JSON');
    }

    return body;
}
