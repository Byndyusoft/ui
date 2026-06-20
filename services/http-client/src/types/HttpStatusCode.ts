import { HTTP_STATUS_CODES } from '../constants';

export type THttpStatusCode = typeof HTTP_STATUS_CODES[keyof typeof HTTP_STATUS_CODES];