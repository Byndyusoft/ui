import axios, { AxiosInstance, AxiosResponse } from 'axios';
import HttpRestController from '../restController';

const DEFAULT_REQUEST_TIMEOUT = 60000;

export class HttpRestControllerAxios extends HttpRestController {
    public axiosInstance: AxiosInstance;

    constructor() {
        super();
        this.axiosInstance = axios.create({
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Cache-control': 'no-cache',
                Pragma: 'no-cache',
                'Access-Control-Expose-Headers': 'Content-Disposition'
            },
            timeout: DEFAULT_REQUEST_TIMEOUT
        });
    }

    setHeader = (key: string, value: string | null): void => {
        this.axiosInstance.defaults.headers[key] = value;
    };

    get = async <T, R = AxiosResponse<T>>(url: string, params: object = {}, options: object = {}): Promise<R> => {
        return this.axiosInstance.get(url, {
            params,
            ...options
        });
    };

    post = async <T, R = AxiosResponse<T>>(
        url: string,
        body?: object,
        params: object = {},
        options: object = {}
    ): Promise<R> => {
        return this.axiosInstance.post(url, body, {
            params,
            ...options
        });
    };

    patch = async <T, R = AxiosResponse<T>>(
        url: string,
        body?: object,
        params: object = {},
        options: object = {}
    ): Promise<R> => {
        return this.axiosInstance.patch(url, body, {
            params,
            ...options
        });
    };

    put = async <T, R = AxiosResponse<T>>(
        url: string,
        body?: object,
        params: object = {},
        options: object = {}
    ): Promise<R> => {
        return this.axiosInstance.put(url, body, {
            params,
            ...options
        });
    };

    delete = async <T, R = AxiosResponse<T>>(url: string, params: object = {}, options: object = {}): Promise<R> => {
        return this.axiosInstance.delete(url, {
            params,
            ...options
        });
    };
}
