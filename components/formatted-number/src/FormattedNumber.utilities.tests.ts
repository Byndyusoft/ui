import { getMaxFractionalPartOfNumbers } from './index';
import { getDefaultFormatter, parseNumberToPartsByDefault } from './FormattedNumber.utilities';

describe('components/FormattedNumber/utilities', () => {
    describe('getMaxFractionalPartOfNumbers', () => {
        test('max fractional part of numbers should be correct', () => {
            const numbers = [123.123, 789.2, 321];

            expect(getMaxFractionalPartOfNumbers(numbers)).toBe(3);
        });
    });

    describe('parseNumberPartsByDefault', () => {
        test('number should be split correctly', () => {
            const formattedNumberString = getDefaultFormatter().format(789456123.123);

            expect(parseNumberToPartsByDefault(formattedNumberString)).toStrictEqual(['789', '456', '123,123']);
        });
    });
});
