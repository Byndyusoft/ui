import { THttpHeaders } from '../../src/types';
import { prepareRequestBody } from '../../src/utilities/prepareRequestBody';

describe('prepareRequestBody', () => {
    test('serializes objects as JSON and adds Content-Type to the provided headers', () => {
        const headers: THttpHeaders = {};

        expect(prepareRequestBody({ name: 'Item' }, headers)).toBe('{"name":"Item"}');
        expect(headers).toEqual({ 'Content-Type': 'application/json' });
    });

    test('does not override an existing Content-Type with different casing', () => {
        const headers = { 'content-type': 'application/vnd.api+json' };

        expect(prepareRequestBody({ name: 'Item' }, headers)).toBe('{"name":"Item"}');
        expect(headers).toEqual({ 'content-type': 'application/vnd.api+json' });
    });

    test('returns FormData unchanged without setting Content-Type', () => {
        const headers: THttpHeaders = {};
        const formData = new FormData();
        formData.append('name', 'Item');

        expect(prepareRequestBody(formData, headers)).toBe(formData);
        expect(headers).toEqual({});
    });

    test('serializes URLSearchParams and adds the form Content-Type', () => {
        const headers: THttpHeaders = {};
        const params = new URLSearchParams({ name: 'Item', role: 'admin' });

        expect(prepareRequestBody(params, headers)).toBe('name=Item&role=admin');
        expect(headers).toEqual({ 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' });
    });

    test.each([
        { name: 'string', body: 'plain text' },
        { name: 'Blob', body: new Blob(['content']) },
        { name: 'ArrayBuffer', body: new ArrayBuffer(2) },
        { name: 'typed array', body: new Uint8Array([1, 2]) }
    ])('returns a $name body unchanged without setting Content-Type', ({ body }) => {
        const headers: THttpHeaders = {};

        expect(prepareRequestBody(body, headers)).toBe(body);
        expect(headers).toEqual({});
    });

    test('throws for circular JSON data', () => {
        const data: Record<string, unknown> = {};
        data.self = data;

        expect(() => prepareRequestBody(data, {})).toThrow(TypeError);
    });

    test('throws when JSON serialization produces no body', () => {
        expect(() => prepareRequestBody(undefined, {})).toThrow('Request body cannot be serialized as JSON');
    });
});
