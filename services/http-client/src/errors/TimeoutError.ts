import { HttpError } from './HttpError';

export class TimeoutError extends HttpError {
    constructor(message: string) {
        super(message);
        this.name = 'TimeoutError';
    }
}
