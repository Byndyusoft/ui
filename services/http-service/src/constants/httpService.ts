import { IHttpServiceOptions } from '../httpService.types';
import HttpRestController from '../restController';

class HttpService<RestController extends HttpRestController> {
    public restController: RestController | undefined;

    public get: RestController['get'];
    public post: RestController['post'];
    public patch: RestController['patch'];
    public put: RestController['put'];
    public delete: RestController['delete'];
    public setHeader: RestController['setHeader'];
    public setTokenData: RestController['setTokenData'];

    constructor(options: IHttpServiceOptions<RestController>) {
        if (options.restController) {
            this.restController = options.restController;

            this.get = this.restController.get;
            this.post = this.restController.post;
            this.patch = this.restController.patch;
            this.put = this.restController.put;
            this.delete = this.restController.delete;
            this.setHeader = this.restController.setHeader;
            this.setTokenData = this.restController.setTokenData;
        } else {
            this.get = () => Promise.reject('get handler was not specified');
            this.post = () => Promise.reject('post handler was not specified');
            this.patch = () => Promise.reject('patch handler was not specified');
            this.put = () => Promise.reject('put handler was not specified');
            this.delete = () => Promise.reject('delete handler was not specified');
            this.setHeader = () => undefined;
            this.setTokenData = () => undefined;
        }
    }
}

export default HttpService;
