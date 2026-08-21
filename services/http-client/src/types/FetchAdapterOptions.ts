/** Request modes that can be explicitly set for a programmatic Fetch request. */
export type TFetchAdapterMode = Exclude<RequestMode, 'navigate'>;

/** Settings that are supported only by the Fetch transport. */
export interface IFetchAdapterOptions {
    cache?: RequestCache;
    credentials?: RequestCredentials;
    integrity?: string;
    keepalive?: boolean;
    mode?: TFetchAdapterMode;
    redirect?: RequestRedirect;
    referrer?: string;
    referrerPolicy?: ReferrerPolicy;
}
