export type THttpParamPrimitive = string | number | boolean;

/** A single query value or a list. `null` / `undefined` omit the key (or list item) when the request is sent. */
export type THttpParamValue = THttpParamPrimitive | null | undefined | Array<THttpParamPrimitive | null | undefined>;

export type THttpParams = Record<string, THttpParamValue>;
