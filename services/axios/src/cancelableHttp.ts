import { Method } from 'axios';
import http from './httpClient';

const controller = new AbortController();

export function getCancelControllerSignal(): AbortSignal {
    return controller.signal;
}

interface ICancelablePromise<T> {
    request: Promise<T>;
    cancel: () => void;
}

export function cancelableHttp<T>(method: Method, url: string, data?: unknown): ICancelablePromise<T> {
    const signal = getCancelControllerSignal();
    const request = http.request<T>({ method, url, signal, data }).then(res => res.data);

    return {
        request,
        cancel: () => controller.abort()
    };
}
