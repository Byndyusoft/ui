import { IHttpServiceOptions } from './httpService.types';
import HttpRestController from './restController';

class HttpService<RestController extends HttpRestController> {
    public restController: RestController | undefined;

    public get: RestController['get'];
    public post: RestController['post'];
    public patch: RestController['patch'];
    public put: RestController['put'];
    public delete: RestController['delete'];
    public setHeader: RestController['setHeader'];

    constructor(options: IHttpServiceOptions<RestController>) {
        if (options.restController) {
            const restController = options.restController;
            this.restController = restController;

            this.get = this.restController.get;
            this.post = this.restController.post;
            this.patch = this.restController.patch;
            this.put = this.restController.put;
            this.delete = this.restController.delete;
            this.setHeader = this.restController.setHeader;
        } else {
            this.get = () => Promise.reject('get handler was not specified');
            this.post = () => Promise.reject('post handler was not specified');
            this.patch = () => Promise.reject('patch handler was not specified');
            this.put = () => Promise.reject('put handler was not specified');
            this.delete = () => Promise.reject('delete handler was not specified');
            this.setHeader = () => undefined;
        }
    }
}

export default HttpService;
