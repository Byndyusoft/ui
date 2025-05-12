import HttpRestController from './restController';

export interface IHttpRequestOptions<RestController = HttpRestController> {
    restController?: RestController;
}
