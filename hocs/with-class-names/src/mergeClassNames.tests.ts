import mergeClassNames from './mergeClassNames';

describe('hocs / withClassNames / mergeClassNames', () => {
    test('should return different classes', () => {
        expect(mergeClassNames({}, { b: '2' })).toEqual({ b: '2' });
        expect(mergeClassNames({ a: '1' }, {})).toEqual({ a: '1' });
        expect(mergeClassNames({ a: '1' }, { b: '2' })).toEqual({ a: '1', b: '2' });
    });

    test('should return replaced classes', () => {
        expect(mergeClassNames({ a: '1' }, { a: '' })).toEqual({ a: '' });
        expect(mergeClassNames({ a: '1' }, { a: undefined })).toEqual({ a: undefined });
        expect(mergeClassNames({ a: '1' }, { a: '2', b: '3' })).toEqual({ a: '2', b: '3' });
    });

    test('should return merged classes', () => {
        expect(mergeClassNames({ a: '1', b: '3' }, { a: '2' }, { withReplace: false })).toEqual({ a: '1 2', b: '3' });
        expect(mergeClassNames({ a: '1', b: '' }, { a: '', b: '3' }, { withReplace: false })).toEqual({
            a: '1',
            b: '3'
        });
    });
});
