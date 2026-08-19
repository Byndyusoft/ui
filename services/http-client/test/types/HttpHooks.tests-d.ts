import { describe, expectTypeOf, it } from 'vitest';
import { HTTP_METHODS, HTTP_STATUS_CODES } from '../../src/constants';
import { HttpResponseError } from '../../src/errors';
import {
    IHttpRequestConfig,
    IHttpResponse,
    THttpRequestErrorHook,
    THttpRequestHook,
    THttpResponseErrorHook,
    THttpResponseHook
} from '../../src/types';

const config: IHttpRequestConfig = { method: HTTP_METHODS.GET, url: '/items' };
const response: IHttpResponse = {
    status: HTTP_STATUS_CODES.OK,
    statusText: 'OK',
    headers: {},
    config
};

describe('THttpRequestHook', () => {
    it('requires a config to be returned, sync or async', () => {
        const hooks: THttpRequestHook[] = [value => value, value => ({ ...value, headers: {} }), async value => value];

        expectTypeOf(hooks).toEqualTypeOf<THttpRequestHook[]>();
    });
});

describe('THttpResponseHook', () => {
    it('requires a response to be returned, sync or async', () => {
        const hooks: THttpResponseHook[] = [value => value, async value => value];

        expectTypeOf(hooks).toEqualTypeOf<THttpResponseHook[]>();
    });
});

describe('THttpRequestErrorHook', () => {
    it('allows returning a config, nothing, or a promise of either', () => {
        const hooks: THttpRequestErrorHook[] = [
            () => config,
            () => undefined,
            () => {},
            async () => config,
            async () => undefined,
            async () => {},
            () => (Date.now() > 0 ? config : undefined)
        ];

        expectTypeOf(hooks).toEqualTypeOf<THttpRequestErrorHook[]>();
    });
});

describe('THttpResponseErrorHook', () => {
    it('accepts errors from adapters and response hooks', () => {
        expectTypeOf<THttpResponseErrorHook>().parameter(0).toEqualTypeOf<unknown>();

        const narrowed: THttpResponseErrorHook = error => {
            if (error instanceof HttpResponseError) {
                expectTypeOf(error.status).toEqualTypeOf<typeof error.status>();
                expectTypeOf(error.config).toEqualTypeOf<IHttpRequestConfig>();
            }
        };

        expectTypeOf(narrowed).toEqualTypeOf<THttpResponseErrorHook>();
    });

    it('allows returning a response, nothing, or a promise of either', () => {
        const hooks: THttpResponseErrorHook[] = [
            () => response,
            () => undefined,
            () => {},
            async () => response,
            async () => undefined,
            async () => {},
            () => (Date.now() > 0 ? response : undefined)
        ];

        expectTypeOf(hooks).toEqualTypeOf<THttpResponseErrorHook[]>();
    });
});
