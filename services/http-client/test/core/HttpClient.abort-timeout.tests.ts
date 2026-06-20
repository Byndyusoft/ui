import { setupServer } from 'msw/node';
import { HttpClient } from '../../src/core/HttpClient';
import { FetchAdapter } from '../../src/adapters/FetchAdapter';
import { XhrAdapter } from '../../src/adapters/XhrAdapter';
import { AbortError, TimeoutError } from '../../src/errors';
import { IHttpClientAdapter } from '../../src/types';

const BASE_URL = 'https://api.test.com';

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const adapters: Array<{ name: string; create: () => IHttpClientAdapter }> = [
    { name: 'FetchAdapter', create: () => new FetchAdapter() },
    { name: 'XhrAdapter', create: () => new XhrAdapter() }
];

describe.each(adapters)('HttpClient.$name — abort', ({ name, create }) => {
    test('throws AbortError when signal is already aborted', async () => {
        const client = new HttpClient({ adapter: create(), baseUrl: BASE_URL });
        const controller = new AbortController();
        controller.abort();

        try {
            await client.get('/').signal(controller.signal).execute();
            expect.fail('Should have thrown');
        } catch (error) {
            expect(error).toBeInstanceOf(AbortError);
        }
    });

    test('throws AbortError when request is aborted via signal', async () => {
        const client = new HttpClient({ adapter: create(), baseUrl: BASE_URL });
        const controller = new AbortController();

        if (name === 'FetchAdapter') {
            vi.stubGlobal(
                'fetch',
                vi.fn((_url: string, init?: RequestInit) => {
                    return new Promise((_resolve, reject) => {
                        init?.signal?.addEventListener('abort', () => {
                            reject(new DOMException('The operation was aborted', 'AbortError'));
                        });
                    });
                })
            );
        } else {
            const mockXHR: XMLHttpRequest = {
                status: 0,
                statusText: '',
                response: '',
                responseText: '',
                responseType: '',
                timeout: 0,
                onload: null,
                onerror: null,
                onabort: null,
                ontimeout: null,
                open: vi.fn(),
                setRequestHeader: vi.fn(),
                send: vi.fn(),
                abort: vi.fn(function (this: XMLHttpRequest) {
                    this.onabort?.(new Event('abort'));
                }),
                getAllResponseHeaders: vi.fn(() => ''),
                getResponseHeader: vi.fn(() => null)
            } as unknown as XMLHttpRequest;

            vi.stubGlobal('XMLHttpRequest', vi.fn(() => mockXHR));
        }

        const promise = client.get('/slow').signal(controller.signal).execute();
        controller.abort();

        try {
            await promise;
            expect.fail('Should have thrown');
        } catch (error) {
            expect(error).toBeInstanceOf(AbortError);
        } finally {
            vi.unstubAllGlobals();
        }
    });
});

describe.each(adapters)('HttpClient.$name — timeout', ({ name, create }) => {
    test('throws TimeoutError when request exceeds timeout', async () => {
        const client = new HttpClient({ adapter: create(), baseUrl: BASE_URL });

        if (name === 'FetchAdapter') {
            vi.stubGlobal(
                'fetch',
                vi.fn((_url: string, init?: RequestInit) => {
                    return new Promise((_resolve, reject) => {
                        init?.signal?.addEventListener('abort', () => {
                            reject(new DOMException('The operation was aborted', 'AbortError'));
                        });
                    });
                })
            );
        } else {
            const mockXHR: XMLHttpRequest = {
                status: 0,
                statusText: '',
                response: '',
                responseText: '',
                responseType: '',
                timeout: 0,
                onload: null,
                onerror: null,
                onabort: null,
                ontimeout: null,
                open: vi.fn(),
                setRequestHeader: vi.fn(),
                send: vi.fn(function (this: XMLHttpRequest) {
                    setTimeout(() => this.ontimeout?.(new Event('timeout')), 0);
                }),
                abort: vi.fn(),
                getAllResponseHeaders: vi.fn(() => ''),
                getResponseHeader: vi.fn(() => null)
            } as unknown as XMLHttpRequest;

            vi.stubGlobal('XMLHttpRequest', vi.fn(() => mockXHR));
        }

        try {
            await client.get('/slow').timeout(50).execute();
            expect.fail('Should have thrown');
        } catch (error) {
            expect(error).toBeInstanceOf(TimeoutError);
            expect((error as TimeoutError).message).toContain('50');
        } finally {
            vi.unstubAllGlobals();
        }
    });
});