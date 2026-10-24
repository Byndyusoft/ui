import { HttpClientError } from './HttpClientError';

/** Indicates that an adapter could not prepare a request before sending it. */
export class RequestPreparationError extends HttpClientError {}

export function isRequestPreparationError(error: unknown): error is RequestPreparationError {
    return error instanceof RequestPreparationError;
}
