export type TValueOrGetter<T> = T extends Function ? never : T | (() => T);
export type TGetter<T> = () => T;

export interface ITokenPayload {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

export type TAccessTokenGetter = TGetter<string | null>;
export type TRefreshTokenGetter = TGetter<string | null>;
export type TTokenExpireTimeGetter = TGetter<number | null>;
export type TTokenRefreshUrlGetter = string;

export interface ITokenData {
    accessToken: TAccessTokenGetter;
    refreshToken: TRefreshTokenGetter;
    expireTime: TTokenExpireTimeGetter;
    tokenRefreshUrl: TTokenRefreshUrlGetter;
    setNewTokenPayload: (arg: ITokenPayload) => void;
    clearTokens: () => void;
}
