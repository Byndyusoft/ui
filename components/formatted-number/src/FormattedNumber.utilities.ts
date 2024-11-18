import { TNumberParts } from './FormattedNumber.types';

function getFractionalPartLengthOfNumber(number: number): number {
    const fractionalPart = number.toString().split('.').at(1);

    return fractionalPart ? fractionalPart.length : 0;
}

export function getMaxFractionalPartOfNumbers(numbers: Array<number>): number | undefined {
    return numbers
        .map(number => getFractionalPartLengthOfNumber(number))
        .sort((a, b) => b - a)
        .at(0);
}

export function getDefaultFormatter(formatterOptions: Intl.NumberFormatOptions = {}): Intl.NumberFormat {
    return new Intl.NumberFormat('ru', formatterOptions);
}

export function parseNumberToPartsByDefault(numberString: string): TNumberParts {
    return numberString.split(/\s/);
}
