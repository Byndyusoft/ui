import { THttpParams } from '../types';

interface IUrlParts {
    path: string;
    query: string;
    hash: string;
}

function splitUrl(value: string): IUrlParts {
    const hashIndex = value.indexOf('#');
    const beforeHash = hashIndex === -1 ? value : value.slice(0, hashIndex);
    const hash = hashIndex === -1 ? '' : value.slice(hashIndex);
    const queryIndex = beforeHash.indexOf('?');

    return {
        path: queryIndex === -1 ? beforeHash : beforeHash.slice(0, queryIndex),
        query: queryIndex === -1 ? '' : beforeHash.slice(queryIndex + 1),
        hash
    };
}

function joinPaths(basePath: string, path: string): string {
    if (!path) {
        return basePath;
    }

    if (!basePath) {
        return path;
    }

    return `${basePath.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}

function getAbsoluteUrl(value: string): URL | undefined {
    try {
        return new URL(value);
    } catch {
        return undefined;
    }
}

function serializeParams(params: THttpParams | undefined): string {
    if (params === undefined) {
        return '';
    }

    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
        const values = Array.isArray(value) ? value : [value];

        for (const item of values) {
            searchParams.append(key, item);
        }
    }

    return searchParams.toString();
}

function appendParams(url: string, params: THttpParams | undefined): string {
    const query = serializeParams(params);

    if (!query) {
        return url;
    }

    const { path, query: existingQuery, hash } = splitUrl(url);
    const combinedQuery = [existingQuery, query].filter(Boolean).join('&');

    return `${path}?${combinedQuery}${hash}`;
}

function resolveRelativeUrl(baseUrl: string, url: string): string {
    const base = splitUrl(baseUrl);
    const request = splitUrl(url);
    const query = [base.query, request.query].filter(Boolean).join('&');

    return `${joinPaths(base.path, request.path)}${query ? `?${query}` : ''}${request.hash}`;
}

function resolveAbsoluteUrl(base: URL, url: string): string {
    const request = splitUrl(url);

    base.pathname = joinPaths(base.pathname, request.path);
    base.hash = request.hash;

    if (request.query) {
        const requestParams = new URLSearchParams(request.query);

        requestParams.forEach((value, key) => {
            base.searchParams.append(key, value);
        });
    }

    return base.toString();
}

/** Resolves a request URL and appends params before its fragment. */
export function buildUrl(baseUrl: string | undefined, url: string, params?: THttpParams): string {
    const absoluteUrl = getAbsoluteUrl(url);

    if (absoluteUrl !== undefined) {
        return appendParams(absoluteUrl.toString(), params);
    }

    if (baseUrl === undefined) {
        return appendParams(url, params);
    }

    const absoluteBaseUrl = getAbsoluteUrl(baseUrl);
    const fullUrl =
        absoluteBaseUrl === undefined ? resolveRelativeUrl(baseUrl, url) : resolveAbsoluteUrl(absoluteBaseUrl, url);

    return appendParams(fullUrl, params);
}
