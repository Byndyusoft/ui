type TRequestUrlParam = string;
type TRequestParams = object;
type TRequestOptions = object;
type TRequestBody = object;

export type TRequestGetArguments = [url: TRequestUrlParam, options?: RequestInit];
export type TRequestPostArguments<B = TRequestBody> = [url: TRequestUrlParam, body?: B];
