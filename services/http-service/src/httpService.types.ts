import HttpRestController from './temporary/restController';

export interface IHttpServiceOptions<RestController = HttpRestController> {
    restController?: RestController;
}
