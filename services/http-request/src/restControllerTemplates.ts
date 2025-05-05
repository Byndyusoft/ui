import { IHTTPRequestRestController } from './restController.types';

export type TFetchGetArguments = [url: string, options?: RequestInit];
export type TFetchPostArgumentsBody = object | string | number | boolean | undefined;
export type TFetchPostArguments = [url: string, body: TFetchPostArgumentsBody, options?: RequestInit];

export type TFetchGetFn = <R>(...args: TFetchGetArguments) => Promise<R>;
export type TFetchPostFn = <R>(...args: TFetchPostArguments) => Promise<R>;

// Default rest controller with 'fetch'
export const fetchRestController: IHTTPRequestRestController<TFetchGetFn, TFetchPostFn> = {
    get: async (...args) => {
        const [url, options] = args;

        try {
            const response = await fetch(url, options);
            return response.json();
        } catch (error) {
            throw error;
        }
    },
    post: async (...args) => {
        const [url, body] = args;
        try {
            const response = await fetch(url, {
                method: 'POST',
                body: body ? JSON.stringify(body) : undefined
            });
            return response.json();
        } catch (error) {
            throw error;
        }
    }
};
