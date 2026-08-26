import { REQUEST_BUILDER_ERROR_CODES } from '../constants';

export type TRequestBuilderErrorCode = (typeof REQUEST_BUILDER_ERROR_CODES)[keyof typeof REQUEST_BUILDER_ERROR_CODES];
