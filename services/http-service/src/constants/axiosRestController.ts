import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import HttpRestController from '../restController';
import { ITokenData, ITokenPayload } from '../token.types';
import { httpStatus } from '../httpStatus';

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

        this.setupInterceptors();
    }

    private tokenData: ITokenData | null = null;

    private refreshTokenRequest: Promise<string> | null = null;

    private isTokenExpired(): boolean {
        const MILLISECONDS_PER_SECOND = 1000;
        const expireTime = this.tokenData == null ? null : this.tokenData.expireTime();

        if (!expireTime) return false;

        return Math.round(new Date().getTime() / MILLISECONDS_PER_SECOND) > expireTime;
    }

    private async refreshTokens(): Promise<string> {
        if (this.refreshTokenRequest) {
            return this.refreshTokenRequest;
        }

        if (!this.tokenData?.refreshToken) {
            throw new Error('No refresh token available');
        }

        try {
            this.refreshTokenRequest = this
                .post<ITokenPayload>(this.tokenData.tokenRefreshUrl, { refreshToken: this.tokenData.refreshToken })
                .then(response => {
                    this.tokenData?.setNewTokenPayload(response.data);

                    return response.data.accessToken;
                })

            return this.refreshTokenRequest;
        } catch (error) {
            this.tokenData?.clearTokens();
            window.location.href = '/login';

            throw new Error(`Token refresh failed: ${error}`);
        } finally {
            this.refreshTokenRequest = null;
        }
    }

    private setupInterceptors(): void {
        this.axiosInstance.interceptors.request.use(async request => {
            const accessToken = this.tokenData?.accessToken();
            const isExpired = this.isTokenExpired();
            const isNotRefreshUrl = request.url !== this.tokenData?.tokenRefreshUrl;

            if (accessToken && !isExpired) {
                request.headers['Authorization'] = `Bearer ${accessToken}`;
            }

            if (isExpired && isNotRefreshUrl) {
                try {
                    const newAccessToken = await this.refreshTokens();
                    request.headers['Authorization'] = `Bearer ${newAccessToken}`;
                } catch (refreshError) {
                    console.error('Session expired');

                    return Promise.reject(refreshError);
                }
            }

            return request;
        });

        this.axiosInstance.interceptors.response.use(
            response => response,
            async (error: AxiosError) => {
                const requestConfig = error.config;
                const isNotRefreshUrl = error.config?.url !== this.tokenData?.tokenRefreshUrl;

                if (error.response?.status === (httpStatus.UNAUTHORIZED as number) && isNotRefreshUrl) {
                    try {
                        const newAccessToken = await this.refreshTokens();

                        if (requestConfig) {
                            requestConfig.headers['Authorization'] = `Bearer ${newAccessToken}`;
                        }

                        return this.axiosInstance(requestConfig ?? {});
                    } catch (refreshError) {
                        console.error('Session expired');

                        return Promise.reject(refreshError);
                    }
                }

                throw error;
            }
        );
    }

    setTokenData(tokenData: ITokenData): void {
        this.tokenData = tokenData;
    };

    setHeader = (key: string, value: string | null): void => {
        this.axiosInstance.defaults.headers[key] = value;
    };

    async get<T, R = AxiosResponse<T>>(url: string, params: object = {}, options: object = {}): Promise<R> {
        return this.axiosInstance.get(url, { params, ...options });
    };

    async post<T, R = AxiosResponse<T>>(
        url: string,
        body?: object,
        params: object = {},
        options: object = {}
    ): Promise<R> {
        return this.axiosInstance.post(url, body, { params, ...options });
    };

    async patch<T, R = AxiosResponse<T>>(
        url: string,
        body?: object,
        params: object = {},
        options: object = {}
    ): Promise<R> {
        return this.axiosInstance.patch(url, body, { params, ...options });
    };

    async put<T, R = AxiosResponse<T>>(
        url: string,
        body?: object,
        params: object = {},
        options: object = {}
    ): Promise<R> {
        return this.axiosInstance.put(url, body, { params, ...options });
    }

    async delete<T, R = AxiosResponse<T>>(url: string, params: object = {}, options: object = {}): Promise<R> {
        return this.axiosInstance.delete(url, { params, ...options });
    };
}
