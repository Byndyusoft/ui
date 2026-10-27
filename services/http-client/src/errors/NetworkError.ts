import { HttpClientError } from './HttpClientError';

export class NetworkError extends HttpClientError {}

export function isNetworkError(error: unknown): error is NetworkError {
    return error instanceof NetworkError;
}
