import HttpRestController from './restController';
import { IHTTPRequestRestController } from './restController.types';
import { fetchRestController, TFetchGetFn, TFetchPostFn } from './restControllerTemplates';

interface IHttpRequestOptions<GetHandler, PostHandler, PatchHandler, PutHandler, DeleteHandler> {
    restController?: IHTTPRequestRestController<GetHandler, PostHandler, PatchHandler, PutHandler, DeleteHandler>;
}

class HttpRequest<
    GetHandler extends (...args: Parameters<GetHandler>) => ReturnType<GetHandler> = TFetchGetFn,
    PostHandler extends (...args: Parameters<PostHandler>) => ReturnType<PostHandler> = TFetchPostFn,
    PatchHandler extends (...args: Parameters<PatchHandler>) => ReturnType<PatchHandler> = TFetchPostFn,
    PutHandler extends (...args: Parameters<PutHandler>) => ReturnType<PutHandler> = TFetchPostFn,
    DeleteHandler extends (...args: Parameters<DeleteHandler>) => ReturnType<DeleteHandler> = TFetchPostFn
> {
    private readonly restController:
        | IHTTPRequestRestController<GetHandler, PostHandler, PatchHandler, PutHandler, DeleteHandler>
        | IHTTPRequestRestController<TFetchGetFn, TFetchPostFn, TFetchPostFn, TFetchPostFn, TFetchPostFn>;

    constructor(options?: IHttpRequestOptions<GetHandler, PostHandler, PatchHandler, PutHandler, DeleteHandler>) {
        if (options?.restController) {
            this.restController = new HttpRestController<
                GetHandler,
                PostHandler,
                PatchHandler,
                PutHandler,
                DeleteHandler
            >(options?.restController);
        } else {
            this.restController = new HttpRestController<
                TFetchGetFn,
                TFetchPostFn,
                TFetchPostFn,
                TFetchPostFn,
                TFetchPostFn
            >(fetchRestController);
        }
    }

    get(...args: Parameters<GetHandler>) {
        try {
            return Function.prototype.apply(this.restController.get, args);
        } catch (exception) {
            throw exception;
        }
    }

    post(...args: Parameters<PostHandler>) {
        try {
            return Function.prototype.apply(this.restController.post, args);
        } catch (exception) {
            throw exception;
        }
    }

    patch(...args: Parameters<PatchHandler>): PatchHandler {
        try {
            return Function.prototype.apply(this.restController.patch, args);
        } catch (exception) {
            throw exception;
        }
    }

    put(...args: Parameters<PutHandler>) {
        try {
            return Function.prototype.apply(this.restController.put, args);
        } catch (exception) {
            throw exception;
        }
    }

    delete(...args: Parameters<DeleteHandler>) {
        try {
            return Function.prototype.apply(this.restController.delete, args);
        } catch (exception) {
            throw exception;
        }
    }
}

// type TTestGet = <R>() => Promise<R>;
// type TTestPost = <R>(url: string, ebody: object) => Promise<R>;

// const TestController = new HttpRestController<TTestGet, TTestPost>({
//     get<R>() {
//         return Promise.resolve() as Promise<R>;
//     },
//     post: (url, body) => {
//         return new Promise(() => {});
//     }
// });

// const Test = new HttpRequest({
//     restController: TestController
// });

export default HttpRequest;
