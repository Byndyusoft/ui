import { REQUEST_BUILDER_ERROR_CODES } from '../constants';
import { TRequestBuilderErrorCode } from '../types';

export class RequestBuilderError extends Error {
    public readonly code: TRequestBuilderErrorCode;

    constructor(message: string, code: TRequestBuilderErrorCode = REQUEST_BUILDER_ERROR_CODES.INVALID_CONFIG) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;

        Object.setPrototypeOf(this, new.target.prototype);
    }
}
