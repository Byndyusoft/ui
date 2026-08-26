import { HTTP_RESPONSE_TYPES } from '../constants';

export type THttpResponseType = (typeof HTTP_RESPONSE_TYPES)[keyof typeof HTTP_RESPONSE_TYPES];
