export interface IHTTPRequestRestController<GetHandler, PostHandler> {
    get: GetHandler;
    post: PostHandler;
}
