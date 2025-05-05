import { IHTTPRequestRestController } from './restController.types';

interface IHttpRestControllerOptions<GetHandler, PostHandler>
    extends IHTTPRequestRestController<GetHandler, PostHandler> {}

class HttpRestController<GetHandler, PostHandler> implements IHTTPRequestRestController<GetHandler, PostHandler> {
    constructor(public options: IHttpRestControllerOptions<GetHandler, PostHandler>) {
        this.get = options.get;
        this.post = options.post;
    }

    get: GetHandler;
    post: PostHandler;

    // post<R>(args: PostArguments): Promise<R> {
    //     return this.options.post(args);
    // }
}

export default HttpRestController;
