import { isStatusAccepted } from '../../src/utilities/isStatusAccepted';

describe('isStatusAccepted', () => {
    test.each([
        { status: 199, expected: false },
        { status: 200, expected: true },
        { status: 299, expected: true },
        { status: 300, expected: false }
    ])('returns $expected for status $status by default', ({ status, expected }) => {
        expect(isStatusAccepted(status)).toBe(expected);
    });

    test('uses the provided predicate', () => {
        const validateStatus = vi.fn((status: number) => status === 404);

        expect(isStatusAccepted(404, validateStatus)).toBe(true);
        expect(validateStatus).toHaveBeenCalledOnce();
        expect(validateStatus).toHaveBeenCalledWith(404);
    });
});
