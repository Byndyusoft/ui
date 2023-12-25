function getFractionalPartLengthOfNumber(number: number): number {
    const fractionalPart = number.toString().split('.').at(1);

    return fractionalPart ? fractionalPart.length : 0;
}

function getMaxFractionalPartOfNumbers(numbers: Array<number>): number | undefined {
    return numbers
        .map(number => getFractionalPartLengthOfNumber(number))
        .sort((a, b) => b - a)
        .at(0);
}

export default getMaxFractionalPartOfNumbers;
