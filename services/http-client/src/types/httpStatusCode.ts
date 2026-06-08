import { HTTP_STATUS_CODES } from '../constants';

export type HttpStatusCode = typeof HTTP_STATUS_CODES[keyof typeof HTTP_STATUS_CODES];