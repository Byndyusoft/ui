import HttpRestController from './restController';
import { IHTTPRequestRestController } from './restController.types';
import { fetchRestController, TFetchGetFn, TFetchPostFn } from './restControllerTemplates';

interface IHttpRestControllerOptions<GetArguments, PostArguments> {
    restController?: IHTTPRequestRestController<GetArguments, PostArguments>;
}

class HttpRequest<
    GetHandler extends (...args: Parameters<GetHandler>) => ReturnType<GetHandler> = TFetchGetFn,
    PostHandler extends (...args: Parameters<PostHandler>) => ReturnType<PostHandler> = TFetchPostFn
> {
    private restController:
        | IHTTPRequestRestController<GetHandler, PostHandler>
        | IHTTPRequestRestController<TFetchGetFn, TFetchPostFn>;

    constructor(options?: IHttpRestControllerOptions<GetHandler, PostHandler>) {
        if (options?.restController) {
            this.restController = new HttpRestController<GetHandler, PostHandler>(options?.restController);
        } else {
            this.restController = new HttpRestController<TFetchGetFn, TFetchPostFn>(fetchRestController);
        }
    }

    get(...args: Parameters<GetHandler>) {
        return Function.prototype.apply(this.restController.get, args) as GetHandler;
    }

    post(...args: Parameters<PostHandler>) {
        return Function.prototype.apply(this.restController.post, args) as PostHandler;
    }
}

// type TTestGet = <R>() => Promise<R>;
// type TTestPost = <R>(url: string, body: object) => Promise<R>;

// const TestController = new HttpRestController<TTestGet, TTestPost>({
//     get<R>() {
//         return Promise.resolve() as Promise<R>;
//     },
//     post: (url, body) => {
//         return new Promise(() => {});
//     }
// });

// const Test = new HttpRequest<TTestGet, TTestPost>({
//     restController: TestController
// });

export default HttpRequest;
