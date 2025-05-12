abstract class HttpRestController {
    abstract get<R>(...args: any[]): Promise<R>;
    abstract post<R>(...args: any[]): Promise<R>;
    abstract patch<R>(...args: any[]): Promise<R>;
    abstract put<R>(...args: any[]): Promise<R>;
    abstract delete<R>(...args: any[]): Promise<R>;
}

export default HttpRestController;
