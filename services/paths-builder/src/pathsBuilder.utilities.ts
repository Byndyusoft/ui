import { ExtractParams, ICreateUrlOptions, TCreateUrlsByPaths, TParamValue } from './pathsBuilder.types';

export function isPathExtendsParams(path: string): boolean {
    const keyMatch = /:([\w-]+)(\??)/.exec(path);

    return keyMatch !== null;
}

function generatePathWithoutParams(path: string): string {
    const prefix = path.startsWith('/') ? '/' : '';
    const suffix = path.endsWith('/') ? '/' : '';

    const segments = path
        .split(/\/+/)
        .map(segment => segment.replace(/\?$/g, '')) // Remove any optional markers from optional static segments
        .filter(segment => !!segment); // Remove empty segments

    return prefix + segments.join('/') + suffix;
}

function generatePathWithParams<Path extends string>(
    path: Path,
    params: {
        [key in ExtractParams<Path>]: TParamValue;
    }
): string {
    const prefix = path.startsWith('/') ? '/' : '';
    const suffix = path.endsWith('/') ? '/' : '';

    const segments = path
        .split(/\/+/)
        .map(segment => {
            // eslint-disable-next-line prefer-named-capture-group
            const keyMatch = /^:([\w-]+)(\??)$/.exec(segment);

            if (keyMatch) {
                const [, key, optional] = keyMatch;
                const value = params[key as ExtractParams<Path>];
                const isOptional = optional === '?';

                if (value === undefined) {
                    if (!isOptional) {
                        throw new Error(`Missing ":${key}" param`);
                    }

                    return '';
                } else if (value === '' || value === null) {
                    return isOptional ? '' : 'null';
                }

                return String(value);
            }

            // Remove any optional markers from optional static segments
            return segment.replace(/\?$/g, '');
        })
        // Remove empty segments
        .filter(segment => !!segment);

    return prefix + segments.join('/') + suffix;
}

export function generatePath<Path extends string>(
    ...args: ExtractParams<Path> extends never
        ? [path: Path]
        : [
              path: Path,
              params: {
                  [key in ExtractParams<Path>]: TParamValue;
              }
          ]
): string {
    const [path, params] = args;

    return isPathExtendsParams(path)
        ? generatePathWithParams(
              path,
              (params ?? {}) as {
                  [key in ExtractParams<Path>]: TParamValue;
              }
          )
        : generatePathWithoutParams(path);
}

function appendBaseUrlToUrlString(url: string, baseUrl?: string): string {
    return `${baseUrl || ''}${url}`;
}

function createUrlWithoutParams(path: string, options: ICreateUrlOptions = {}): string {
    const resultUrl = generatePathWithoutParams(path);

    return appendBaseUrlToUrlString(resultUrl, options.baseUrl);
}

function createUrlWithParams<Path extends string>(
    path: Path,
    params: {
        [key in ExtractParams<Path>]: TParamValue;
    },
    options: ICreateUrlOptions = {}
): string {
    const resultUrl = generatePathWithParams(path, params);

    return appendBaseUrlToUrlString(resultUrl, options.baseUrl);
}

export function createUrl<Path extends string>(
    ...args: ExtractParams<Path> extends never
        ? [path: Path, options?: ICreateUrlOptions]
        : [
              path: Path,
              params: {
                  [key in ExtractParams<Path>]: TParamValue;
              },
              options?: ICreateUrlOptions
          ]
): string {
    const [path, ...restArgs] = args;

    const hasParams = isPathExtendsParams(path);
    const params = (restArgs[0] ?? {}) as { [key in ExtractParams<Path>]: TParamValue };
    const options = (restArgs[hasParams ? 1 : 0] ?? {}) as ICreateUrlOptions;

    const resultUrl = hasParams ? generatePathWithParams(path, params) : generatePathWithoutParams(path);

    return appendBaseUrlToUrlString(resultUrl, options.baseUrl);
}

export function createUrlsByPaths<Paths extends Record<string, string>>(
    paths: Paths,
    options: ICreateUrlOptions = {}
): TCreateUrlsByPaths<Paths> {
    const urls = {} as TCreateUrlsByPaths<Paths>;

    Object.keys(paths).forEach((key: keyof Paths) => {
        const currentPath = paths[key];

        // @ts-ignore
        urls[key] = isPathExtendsParams(currentPath)
            ? (
                  params: {
                      [key in ExtractParams<typeof currentPath>]: TParamValue;
                  },
                  currentOptions: ICreateUrlOptions = {}
              ) => createUrlWithParams(currentPath, params, { ...options, ...currentOptions })
            : (currentOptions: ICreateUrlOptions = {}) =>
                  createUrlWithoutParams(currentPath, { ...options, ...currentOptions });
    });

    return urls;
}
