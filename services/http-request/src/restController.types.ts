export interface IHTTPRestController<GetHandler, PostHandler, PatchHandler, PutHandler, DeleteHandler> {
    get: GetHandler;
    post: PostHandler;
    patch?: PatchHandler | undefined;
    put?: PutHandler | undefined;
    delete?: DeleteHandler | undefined;
}

export interface IHttpRestControllerOptions<
    GetHandler,
    PostHandler,
    PatchHandler = undefined,
    PutHandler = undefined,
    DeleteHandler = undefined
> extends IHTTPRestController<GetHandler, PostHandler, PatchHandler, PutHandler, DeleteHandler> {}
