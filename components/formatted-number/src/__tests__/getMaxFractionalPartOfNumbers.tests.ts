import { getMaxFractionalPartOfNumbers } from '../index';

describe('components/FormattedNumber/getMaxFractionalPartOfNumbers', () => {
    test('max fractional part of numbers should be correct', () => {
        const numbers = [123.123, 789.2, 321];

        expect(getMaxFractionalPartOfNumbers(numbers)).toBe(3);
    });
});
