export type THttpParamPrimitive = string | number | boolean;

export type THttpParamValue = THttpParamPrimitive | Array<THttpParamPrimitive>;

export type THttpParams = Record<string, THttpParamValue>;
