import { HttpError } from './HttpError';

export class NetworkError extends HttpError {
    constructor(message: string) {
        super(message);
        this.name = 'NetworkError';
    }
}
