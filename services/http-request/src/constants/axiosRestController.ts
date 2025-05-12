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

    async get<T, R = AxiosResponse<T>>(url: string, params: object = {}, options: object = {}): Promise<R> {
        return this.axiosInstance.get(url, {
            params,
            ...options
        });
    }

    async post<T, R = AxiosResponse<T>>(
        url: string,
        body?: object,
        params: object = {},
        options: object = {}
    ): Promise<R> {
        return this.axiosInstance.post(url, body, {
            params,
            ...options
        });
    }

    async patch<T, R = AxiosResponse<T>>(
        url: string,
        body?: object,
        params: object = {},
        options: object = {}
    ): Promise<R> {
        return this.axiosInstance.patch(url, body, {
            params,
            ...options
        });
    }

    async put<T, R = AxiosResponse<T>>(
        url: string,
        body?: object,
        params: object = {},
        options: object = {}
    ): Promise<R> {
        return this.axiosInstance.put(url, body, {
            params,
            ...options
        });
    }

    async delete<T, R = AxiosResponse<T>>(url: string, params: object = {}, options: object = {}): Promise<R> {
        return this.axiosInstance.delete(url, {
            params,
            ...options
        });
    }
}
