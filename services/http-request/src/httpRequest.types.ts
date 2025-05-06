import { IHTTPRestController } from './restController.types';

export interface IHttpRequestOptions<GetHandler, PostHandler, PatchHandler, PutHandler, DeleteHandler> {
    restController?: IHTTPRestController<GetHandler, PostHandler, PatchHandler, PutHandler, DeleteHandler>;
}
