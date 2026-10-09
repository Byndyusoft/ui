import { HttpClientError } from './HttpClientError';

export class AbortError extends HttpClientError {}

export function isAbortError(error: unknown): error is AbortError {
    return error instanceof AbortError;
}
