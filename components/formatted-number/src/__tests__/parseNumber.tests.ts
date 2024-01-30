import getDefaultFormatter from '../getDefaultFormatter';
import parseNumberToPartsByDefault from '../parseNumberToPartsByDefault';

describe('components/FormattedNumber/parseNumberPartsByDefault', () => {
    test('number should be split correctly', () => {
        const formattedNumberString = getDefaultFormatter().format(789456123.123);

        expect(parseNumberToPartsByDefault(formattedNumberString)).toStrictEqual(['789', '456', '123,123']);
    });
});
