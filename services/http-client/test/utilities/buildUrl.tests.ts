import { buildUrl } from '../../src/utilities/buildUrl';

describe('buildUrl', () => {
    test('joins an absolute base URL with a relative request URL', () => {
        expect(buildUrl('https://api.example.test/v1/', '/users')).toBe('https://api.example.test/v1/users');
    });

    test('preserves existing query values and appends params before the fragment', () => {
        expect(
            buildUrl('https://api.example.test/v1?locale=ru', '/users?sort=name#list', {
                page: 2,
                active: true,
                role: ['admin', 'editor'],
                omitted: null
            })
        ).toBe('https://api.example.test/v1/users?locale=ru&sort=name&page=2&active=true&role=admin&role=editor#list');
    });

    test('does not apply baseUrl to an absolute request URL', () => {
        expect(
            buildUrl('https://api.example.test/v1', 'https://cdn.example.test/file?id=1#preview', { raw: false })
        ).toBe('https://cdn.example.test/file?id=1&raw=false#preview');
    });

    test('supports relative base and request URLs', () => {
        expect(buildUrl('/api?locale=ru', '/users?sort=name#list', { page: 1 })).toBe(
            '/api/users?locale=ru&sort=name&page=1#list'
        );
    });

    test('returns the request URL unchanged when baseUrl and params are absent', () => {
        expect(buildUrl(undefined, '/users#list')).toBe('/users#list');
    });
});
