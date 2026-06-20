import { HTTP_METHODS } from '../constants';

export type THttpMethod = typeof HTTP_METHODS[keyof typeof HTTP_METHODS];