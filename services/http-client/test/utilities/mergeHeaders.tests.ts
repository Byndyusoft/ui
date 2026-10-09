import { hasHeader, mergeHeaders } from '../../src/utilities/mergeHeaders';

describe('mergeHeaders', () => {
    test('merges sources from left to right using case-insensitive names', () => {
        expect(
            mergeHeaders(
                { Authorization: 'Bearer default', Accept: 'application/json' },
                { authorization: 'Bearer request', 'X-Request': 'request' }
            )
        ).toEqual({ Accept: 'application/json', authorization: 'Bearer request', 'X-Request': 'request' });
    });

    test('returns an independent object without mutating sources', () => {
        const headers = { Accept: 'application/json' };
        const result = mergeHeaders(headers);

        result.Accept = 'text/plain';

        expect(headers).toEqual({ Accept: 'application/json' });
    });

    test('returns an empty object when sources are absent', () => {
        expect(mergeHeaders(undefined)).toEqual({});
    });
});

describe('hasHeader', () => {
    test('finds a header using case-insensitive comparison', () => {
        expect(hasHeader({ 'content-type': 'application/json' }, 'Content-Type')).toBe(true);
    });

    test('returns false when the header is absent', () => {
        expect(hasHeader({ Accept: 'application/json' }, 'Content-Type')).toBe(false);
    });
});
