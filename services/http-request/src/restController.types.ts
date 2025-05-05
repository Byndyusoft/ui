export interface IHTTPRequestRestController<GetHandler, PostHandler, PatchHandler, PutHandler, DeleteHandler> {
    get: GetHandler;
    post: PostHandler;
    patch?: PatchHandler | undefined;
    put?: PutHandler | undefined;
    delete?: DeleteHandler | undefined;
}
