abstract class HttpRestController {
    abstract get<R>(...args: any[]): Promise<R>;
    abstract post<R>(...args: any[]): Promise<R>;
    abstract patch<R>(...args: any[]): Promise<R>;
    abstract put<R>(...args: any[]): Promise<R>;
    abstract delete<R>(...args: any[]): Promise<R>;
    public setHeader: (...args: any[]) => void;

    constructor() {
        this.setHeader = () => {
            console.error('setHeader for HttpRestController is undefined');
        };
    }
}

export default HttpRestController;
