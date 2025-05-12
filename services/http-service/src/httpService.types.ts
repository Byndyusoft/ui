import HttpRestController from './restController';

export interface IHttpServiceOptions<RestController = HttpRestController> {
    restController?: RestController;
}
