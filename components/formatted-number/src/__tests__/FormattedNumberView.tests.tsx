import React from 'react';
import { render, screen } from '@testing-library/react';
import FormattedNumberView, { SYMBOL_BETWEEN_FORMATTED_NUMBER_PARTS_LABEL } from '../FormattedNumberView';
import { getMaxFractionalPartOfNumbers } from '../index';

describe('components/FormattedNumber', () => {
    test('simple number renders correctly', () => {
        render(<FormattedNumberView number={123.123} />);

        expect(screen.getByText('123,123')).toBeInTheDocument();
    });

    test('thin spaces render correctly', () => {
        render(<FormattedNumberView number={56734534321.223} />);

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

        render(<FormattedNumberView number={123} defaultFormatterOptions={defaultFormatterOptions} />);

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
                        <FormattedNumberView number={number} defaultFormatterOptions={defaultFormatterOptions} />
                    </span>
                ))}
            </div>
        );

        expect(screen.getByText('123,123')).toBeInTheDocument();
        expect(screen.getByText('789,200')).toBeInTheDocument();
        expect(screen.getByText('321,000')).toBeInTheDocument();
    });
});
