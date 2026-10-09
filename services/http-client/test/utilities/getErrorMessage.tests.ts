import { getErrorMessage } from '../../src/utilities/getErrorMessage';

describe('getErrorMessage', () => {
    test('returns a non-empty Error message', () => {
        expect(getErrorMessage(new Error('Request failed'), 'Fallback')).toBe('Request failed');
    });

    test.each([new Error(''), 'Request failed', null, undefined])('returns the fallback for %p', error => {
        expect(getErrorMessage(error, 'Fallback')).toBe('Fallback');
    });
});
