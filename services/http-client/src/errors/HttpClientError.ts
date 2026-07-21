/** Базовый класс всех ошибок http-клиента. Позволяет поймать любую ошибку клиента одной проверкой instanceof. */
export class HttpClientError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;

        Object.setPrototypeOf(this, new.target.prototype);
    }
}
