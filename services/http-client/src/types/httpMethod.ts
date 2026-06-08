import { HTTP_METHODS } from '../constants';

export type HttpMethod = typeof HTTP_METHODS[keyof typeof HTTP_METHODS];