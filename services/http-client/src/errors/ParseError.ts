import { HttpError } from './HttpError';

export class ParseError extends HttpError {
    constructor(message: string) {
        super(message);
        this.name = 'ParseError';
    }
}
