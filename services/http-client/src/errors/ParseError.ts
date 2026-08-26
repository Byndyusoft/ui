import { THttpResponseType } from '../types';
import { HttpClientError, IHttpClientErrorOptions } from './HttpClientError';

export interface IParseErrorOptions extends IHttpClientErrorOptions {
    responseType?: THttpResponseType;
    raw?: string;
}

/** Indicates that a successful response could not be parsed in the requested format. */
export class ParseError extends HttpClientError {
    public readonly responseType?: THttpResponseType;
    public readonly raw?: string;

    constructor(message: string, options?: IParseErrorOptions) {
        super(message, options);

        this.responseType = options?.responseType;
        this.raw = options?.raw;
    }
}

export function isParseError(error: unknown): error is ParseError {
    return error instanceof ParseError;
}
