import { IHttpRequestOptions } from './httpRequest.types';
import HttpRestController from './restController';
import { IHTTPRestController } from './restController.types';
import { fetchRestController, TFetchGetFn, TFetchPostFn } from './restControllerTemplates';

class HttpRequest<
    GetHandler extends (...args: Parameters<GetHandler>) => ReturnType<GetHandler> = <R>(
        ...args: Parameters<TFetchGetFn>
    ) => R,
    PostHandler extends (...args: Parameters<PostHandler>) => ReturnType<PostHandler> = <R>(
        ...args: Parameters<TFetchPostFn>
    ) => R,
    PatchHandler extends (...args: Parameters<PatchHandler>) => ReturnType<PatchHandler> = <R>(
        ...args: Parameters<TFetchPostFn>
    ) => R,
    PutHandler extends (...args: Parameters<PutHandler>) => ReturnType<PutHandler> = <R>(
        ...args: Parameters<TFetchPostFn>
    ) => R,
    DeleteHandler extends (...args: Parameters<DeleteHandler>) => ReturnType<DeleteHandler> = <R>(
        ...args: Parameters<TFetchPostFn>
    ) => R
> {
    private readonly restController:
        | IHTTPRestController<GetHandler, PostHandler, PatchHandler, PutHandler, DeleteHandler>
        | IHTTPRestController<TFetchGetFn, TFetchPostFn, TFetchPostFn, TFetchPostFn, TFetchPostFn>;

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

    get<R>(...args: Parameters<GetHandler>): Promise<R> {
        try {
            return Function.prototype.apply(this.restController.get, args);
        } catch (exception) {
            throw exception;
        }
    }

    post<R>(...args: Parameters<PostHandler>): Promise<R> {
        try {
            return Function.prototype.apply(this.restController.post, args);
        } catch (exception) {
            throw exception;
        }
    }

    patch<R>(...args: Parameters<PatchHandler>): Promise<R> {
        try {
            return Function.prototype.apply(this.restController.patch, args);
        } catch (exception) {
            throw exception;
        }
    }

    put<R>(...args: Parameters<PutHandler>): Promise<R> {
        try {
            return Function.prototype.apply(this.restController.put, args);
        } catch (exception) {
            throw exception;
        }
    }

    delete<R>(...args: Parameters<DeleteHandler>): Promise<R> {
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

async () => {
    const TestController = new HttpRestController({
        get(url: string) {
            console.log(url);
            return Promise.resolve();
        },
        post: (url: string, body: object) => {
            console.log({ url, body });
            return new Promise(() => {});
        }
    });

    const httpRequestService = new HttpRequest({
        restController: TestController
    });

    const data = await httpRequestService.get<{ data: string }>('http://localhost:1234/api');
};

export default HttpRequest;
