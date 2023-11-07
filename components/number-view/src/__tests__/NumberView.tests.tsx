import React from 'react';
import { render, screen, within } from '@testing-library/react';
import NumberView, { THIN_INEXTRICABLE_SPACE_LABEL } from '../NumberView';
import { PARENTHESIS_FOOTNOTE_LABEL } from '../FootnoteView';

describe('components/NumberView', () => {
    test('simple numbers render correctly', () => {
        render(<NumberView numbersData={[{ number: 123.123 }, { number: 321.321 }]} />);

        expect(screen.getByText('123,123')).toBeInTheDocument();
        expect(screen.getByText('321,321')).toBeInTheDocument();
    });

    test('fractional parts calculates correctly', () => {
        render(<NumberView numbersData={[{ number: 123.123 }, { number: 789.2 }, { number: 321 }]} />);

        expect(screen.getByText('123,123')).toBeInTheDocument();
        expect(screen.getByText('789,200')).toBeInTheDocument();
        expect(screen.getByText('321,000')).toBeInTheDocument();
    });

    test('thin spaces render correctly', () => {
        render(<NumberView numbersData={[{ number: 56734534321.223 }]} />);

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

    test('footnotes render correctly', () => {
        const numbersData = [
            {
                number: 123,
                footnote: {
                    type: NumberView.footnoteTypes.SUP_TEXT,
                    value: '*'
                }
            },
            {
                number: 1354,
                footnote: {
                    type: NumberView.footnoteTypes.SUP_TEXT,
                    value: '+10',
                    valueSizeModifier: NumberView.footnoteValueSizeMods.SMALLER
                }
            },
            {
                number: 927,
                footnote: {
                    type: NumberView.footnoteTypes.PARENTHESES
                }
            }
        ];

        render(<NumberView numbersData={numbersData} />);

        expect(screen.getByText('*', { exact: false })).toBeInTheDocument();
        expect(screen.getByText('+10', { exact: false })).toBeInTheDocument();

        const parenthesisFootnoteElement = screen.getByLabelText(PARENTHESIS_FOOTNOTE_LABEL);

        expect(parenthesisFootnoteElement).toBeInTheDocument();
        expect(within(parenthesisFootnoteElement).getByText('927')).toBeInTheDocument();
    });

    test('custom formatter options render correctly', () => {
        const numbersData = [
            {
                number: 123,
                footnote: {
                    type: NumberView.footnoteTypes.SUP_TEXT,
                    value: '*'
                }
            }
        ];

        const formatterOptions = {
            style: 'currency',
            currency: 'RUB'
        };

        render(<NumberView numbersData={numbersData} formatterOptions={formatterOptions} />);

        expect(screen.getByLabelText(THIN_INEXTRICABLE_SPACE_LABEL)).toBeInTheDocument();
        expect(screen.getByText('₽', { exact: false })).toBeInTheDocument();
    });
});
