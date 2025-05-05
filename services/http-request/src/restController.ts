import { IHTTPRequestRestController } from './restController.types';

interface IHttpRestControllerOptions<
    GetHandler,
    PostHandler,
    PatchHandler = undefined,
    PutHandler = undefined,
    DeleteHandler = undefined
> extends IHTTPRequestRestController<GetHandler, PostHandler, PatchHandler, PutHandler, DeleteHandler> {}

class HttpRestController<
    GetHandler,
    PostHandler,
    PatchHandler = undefined,
    PutHandler = undefined,
    DeleteHandler = undefined
> implements IHTTPRequestRestController<GetHandler, PostHandler, PatchHandler, PutHandler, DeleteHandler>
{
    constructor(
        public options: IHttpRestControllerOptions<GetHandler, PostHandler, PatchHandler, PutHandler, DeleteHandler>
    ) {
        this.get = options.get;
        this.post = options.post;
        this.patch = options.patch;
        this.put = options.put;
        this.delete = options.delete;
    }

    get: GetHandler;
    post: PostHandler;
    patch: PatchHandler | undefined;
    put: PutHandler | undefined;
    delete: DeleteHandler | undefined;
}

export default HttpRestController;
