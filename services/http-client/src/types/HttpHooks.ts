/* eslint-disable @typescript-eslint/no-invalid-void-type --
 * void здесь намеренен: хуки ошибок могут ничего не возвращать,
 * и только void принимает функцию без return вроде `(error) => { log(error); }`. */
import { IHttpRequestConfig } from './HttpRequestConfig';
import { IHttpResponse } from './HttpResponse';

/**
 * Вызывается один раз на запрос после слияния с дефолтным конфигом клиента,
 * непосредственно перед вызовом адаптера.
 * Возвращённый конфиг продолжает путь по pipeline. Брошенная ошибка уходит в onRequestError.
 */
export type THttpRequestHook = (config: IHttpRequestConfig) => IHttpRequestConfig | Promise<IHttpRequestConfig>;

/** Конфиг, с которым запрос будет продолжен, или ничего — тогда перевыбрасывается исходная ошибка. */
export type THttpRequestErrorHookResult = IHttpRequestConfig | void;

/** Вызывается, только если хук onRequest бросил исключение или отклонил промис. */
export type THttpRequestErrorHook = (
    error: unknown
) => THttpRequestErrorHookResult | Promise<THttpRequestErrorHookResult>;

/**
 * Вызывается один раз на запрос, когда адаптер успешно зарезолвился (2xx).
 * Возвращённый ответ уходит вызывающему коду. Брошенная ошибка уходит в onResponseError.
 */
export type THttpResponseHook = (response: IHttpResponse) => IHttpResponse | Promise<IHttpResponse>;

/** Ответ для восстановления (onResponse на нём повторно НЕ вызывается), или ничего — тогда перевыбрасывается исходная ошибка. */
export type THttpResponseErrorHookResult = IHttpResponse | void;

/**
 * Вызывается, когда адаптер отклонил промис или когда хук onResponse бросил ошибку.
 */
export type THttpResponseErrorHook = (
    error: unknown
) => THttpResponseErrorHookResult | Promise<THttpResponseErrorHookResult>;
