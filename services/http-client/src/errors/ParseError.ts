import { HttpClientError } from './HttpClientError';

/** Indicates that a successful response could not be parsed in the requested format. */
export class ParseError extends HttpClientError {}
