/* eslint-disable @typescript-eslint/no-invalid-void-type --
 * void is intentional: error hooks may not return a value,
 * and only void accepts a function without return such as `(error) => { log(error); }`. */
import { IHttpRequestConfig } from './HttpRequestConfig';
import { IHttpResponse } from './HttpResponse';

/**
 * Called once per request after merging with the client's default configuration,
 * immediately before the adapter is called.
 * The returned config continues through the pipeline. A thrown error is passed to onRequestError.
 */
export type THttpRequestHook = (config: IHttpRequestConfig) => IHttpRequestConfig | Promise<IHttpRequestConfig>;

/** A config that continues the request, or nothing, in which case the original error is rethrown. */
export type THttpRequestErrorHookResult = IHttpRequestConfig | void;

/** Called only when onRequest throws or rejects. */
export type THttpRequestErrorHook = (
    error: unknown
) => THttpRequestErrorHookResult | Promise<THttpRequestErrorHookResult>;

/**
 * Called once per request when the adapter resolves successfully (2xx).
 * The returned response is passed to the caller. A thrown error is passed to onResponseError.
 */
export type THttpResponseHook = (response: IHttpResponse) => IHttpResponse | Promise<IHttpResponse>;

/** A recovery response (onResponse is not called for it again), or nothing, in which case the original error is rethrown. */
export type THttpResponseErrorHookResult = IHttpResponse | void;

/**
 * Called when the adapter rejects or when onResponse throws.
 */
export type THttpResponseErrorHook = (
    error: unknown
) => THttpResponseErrorHookResult | Promise<THttpResponseErrorHookResult>;
