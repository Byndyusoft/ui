// eslint-disable-next-line @typescript-eslint/naming-convention
type ExtractParam<Path> = Path extends `:${infer Param}`
    ? Param extends `${infer Optional}?`
        ? Optional
        : Param
    : never;

// eslint-disable-next-line @typescript-eslint/naming-convention
export type ExtractParams<Path extends string> = Path extends `${infer Segment}/${infer Rest}`
    ? ExtractParams<Segment> | ExtractParams<Rest>
    : ExtractParam<Path>;

export type TParamValue = number | string | null;

export interface ICreateUrlOptions {
    baseUrl?: string;
}

export type TCreateUrlsByPaths<Paths extends Record<string, string>> = {
    [PathKey in keyof Paths]: ExtractParams<Paths[PathKey]> extends never
        ? (options?: ICreateUrlOptions) => string
        : (
              params: {
                  [key in ExtractParams<Paths[PathKey]>]: TParamValue;
              },
              options?: ICreateUrlOptions
          ) => string;
};
