import { HttpClientError } from './HttpClientError';

export class TimeoutError extends HttpClientError {}

export function isTimeoutError(error: unknown): error is TimeoutError {
    return error instanceof TimeoutError;
}
