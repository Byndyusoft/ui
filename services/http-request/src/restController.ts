import { IHTTPRestController, IHttpRestControllerOptions } from './restController.types';

class HttpRestController<
    GetHandler,
    PostHandler,
    PatchHandler = undefined,
    PutHandler = undefined,
    DeleteHandler = undefined
> implements IHTTPRestController<GetHandler, PostHandler, PatchHandler, PutHandler, DeleteHandler>
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
