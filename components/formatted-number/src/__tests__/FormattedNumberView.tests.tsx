import React from 'react';
import { render, screen } from '@testing-library/react';
import FormattedNumberView, { THIN_INEXTRICABLE_SPACE_LABEL } from '../FormattedNumberView';
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

        const thinSpacesArray = screen.getAllByLabelText(THIN_INEXTRICABLE_SPACE_LABEL);

        expect(thinSpacesArray).toHaveLength(3);
        thinSpacesArray.forEach(element => {
            expect(element).toBeInTheDocument();
        });
    });

    test('custom formatter options render correctly', () => {
        const formatterOptions = {
            style: 'currency',
            currency: 'RUB'
        };

        render(<FormattedNumberView number={123} formatterOptions={formatterOptions} />);

        expect(screen.getByLabelText(THIN_INEXTRICABLE_SPACE_LABEL)).toBeInTheDocument();
        expect(screen.getByText('₽', { exact: false })).toBeInTheDocument();
    });

    test('fractional parts calculates correctly', () => {
        const numbers = [123.123, 789.2, 321];

        const formatterOptions = {
            minimumFractionDigits: getMaxFractionalPartOfNumbers(numbers)
        };

        render(
            <div>
                {numbers.map(number => (
                    <FormattedNumberView key={number} number={number} formatterOptions={formatterOptions} />
                ))}
            </div>
        );

        expect(screen.getByText('123,123')).toBeInTheDocument();
        expect(screen.getByText('789,200')).toBeInTheDocument();
        expect(screen.getByText('321,000')).toBeInTheDocument();
    });
});
