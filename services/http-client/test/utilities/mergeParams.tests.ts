import { THttpParams } from '../../src/types';
import { mergeParams } from '../../src/utilities/mergeParams';

describe('mergeParams', () => {
    test('merges sources from left to right and removes nullish overrides', () => {
        expect(
            mergeParams({ page: 1, locale: 'ru', active: true }, { page: 2, locale: null, active: false, offset: 0 })
        ).toEqual({ page: 2, active: false, offset: 0 });
    });

    test('drops nullish array items and copies arrays', () => {
        const roles = ['admin', null, undefined, 'editor'];
        const source: THttpParams = { roles };
        const result = mergeParams(source);

        expect(result).toEqual({ roles: ['admin', 'editor'] });
        expect(result?.roles).not.toBe(roles);
        expect(source.roles).toBe(roles);
    });

    test.each([
        { name: 'sources are absent', sources: [] },
        { name: 'sources are undefined', sources: [undefined] },
        { name: 'only nullish values remain', sources: [{ page: null, roles: [undefined, null] }] }
    ])('returns undefined when $name', ({ sources }) => {
        expect(mergeParams(...(sources as Array<THttpParams | undefined>))).toBeUndefined();
    });
});
