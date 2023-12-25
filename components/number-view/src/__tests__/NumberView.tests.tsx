import React from 'react';
import { render, screen, within } from '@testing-library/react';
import NumberView, { THIN_INEXTRICABLE_SPACE_LABEL } from '../NumberView';
import { PARENTHESIS_FOOTNOTE_LABEL } from '../FootnoteView';
import { getMaxFractionalPartOfNumbers } from '../index';

describe('components/NumberView', () => {
    test('simple number renders correctly', () => {
        render(<NumberView number={123.123} />);

        expect(screen.getByText('123,123')).toBeInTheDocument();
    });

    test('thin spaces render correctly', () => {
        render(<NumberView number={56734534321.223} />);

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

    describe('check footnotes', () => {
        test('superscript text should renders correctly', () => {
            render(
                <NumberView
                    number={123}
                    footnote={{
                        type: NumberView.footnoteTypes.SUP_TEXT,
                        value: '*'
                    }}
                />
            );

            expect(screen.getByText('*', { exact: false })).toBeInTheDocument();
        });

        test('small superscript text should renders correctly', () => {
            render(
                <NumberView
                    number={1354}
                    footnote={{
                        type: NumberView.footnoteTypes.SUP_TEXT,
                        value: '+10',
                        valueSizeModifier: NumberView.footnoteValueSizeMods.SMALLER
                    }}
                />
            );

            expect(screen.getByText('+10', { exact: false })).toBeInTheDocument();
        });

        test('parentheses should render correctly', () => {
            render(
                <NumberView
                    number={927}
                    footnote={{
                        type: NumberView.footnoteTypes.PARENTHESES
                    }}
                />
            );

            const parenthesisFootnoteElement = screen.getByLabelText(PARENTHESIS_FOOTNOTE_LABEL);

            expect(parenthesisFootnoteElement).toBeInTheDocument();
            expect(within(parenthesisFootnoteElement).getByText('927')).toBeInTheDocument();
        });
    });

    test('custom formatter options render correctly', () => {
        const formatterOptions = {
            style: 'currency',
            currency: 'RUB'
        };

        render(
            <NumberView
                number={123}
                footnote={{
                    type: NumberView.footnoteTypes.SUP_TEXT,
                    value: '*'
                }}
                formatterOptions={formatterOptions}
            />
        );

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
                    <NumberView key={number} number={number} formatterOptions={formatterOptions} />
                ))}
            </div>
        );

        expect(screen.getByText('123,123')).toBeInTheDocument();
        expect(screen.getByText('789,200')).toBeInTheDocument();
        expect(screen.getByText('321,000')).toBeInTheDocument();
    });
});
