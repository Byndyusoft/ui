import React from 'react';
import { render, screen } from '@testing-library/react';
import FormattedNumber, { SYMBOL_BETWEEN_FORMATTED_NUMBER_PARTS_LABEL } from './FormattedNumber';
import { getMaxFractionalPartOfNumbers } from './FormattedNumber.utilities';

describe('components/FormattedNumber', () => {
    test('simple number renders correctly', () => {
        render(
            <>
                <span>
                    <FormattedNumber number={123.123} />
                </span>
                <span>
                    <FormattedNumber number={-321.321} />
                </span>
            </>
        );

        expect(screen.getByText('123,123')).toBeInTheDocument();
        expect(screen.getByText('−321,321')).toBeInTheDocument();
    });

    test('thin spaces render correctly', () => {
        render(<FormattedNumber number={56734534321.223} />);

        expect(screen.getByText('56', { exact: false })).toBeInTheDocument();
        expect(screen.getByText('734', { exact: false })).toBeInTheDocument();
        expect(screen.getByText('534', { exact: false })).toBeInTheDocument();
        expect(screen.getByText('321,223', { exact: false })).toBeInTheDocument();

        const thinSpacesArray = screen.getAllByLabelText(SYMBOL_BETWEEN_FORMATTED_NUMBER_PARTS_LABEL);

        expect(thinSpacesArray).toHaveLength(3);
        thinSpacesArray.forEach(element => {
            expect(element).toBeInTheDocument();
        });
    });

    test('custom formatter options render correctly', () => {
        const defaultFormatterOptions = {
            style: 'currency',
            currency: 'RUB'
        };

        render(<FormattedNumber number={123} defaultFormatterOptions={defaultFormatterOptions} />);

        expect(screen.getByLabelText(SYMBOL_BETWEEN_FORMATTED_NUMBER_PARTS_LABEL)).toBeInTheDocument();
        expect(screen.getByText('₽', { exact: false })).toBeInTheDocument();
    });

    test('fractional parts calculates correctly', () => {
        const numbers = [123.123, 789.2, 321];

        const defaultFormatterOptions = {
            minimumFractionDigits: getMaxFractionalPartOfNumbers(numbers)
        };

        render(
            <div>
                {numbers.map(number => (
                    <span key={number}>
                        <FormattedNumber number={number} defaultFormatterOptions={defaultFormatterOptions} />
                    </span>
                ))}
            </div>
        );

        expect(screen.getByText('123,123')).toBeInTheDocument();
        expect(screen.getByText('789,200')).toBeInTheDocument();
        expect(screen.getByText('321,000')).toBeInTheDocument();
    });
});
