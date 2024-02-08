import React from 'react';
import { IFormattedNumberViewProps } from '../FormattedNumberView.types';
import FormattedNumber, { getMaxFractionalPartOfNumbers } from '..';
import styles from './FormattedNumberView.stories.module.css';

const Template: (args: IFormattedNumberViewProps) => JSX.Element = (args: IFormattedNumberViewProps) => (
    <div className={styles.templateContainer}>
        <span>
            <FormattedNumber {...args} />
        </span>
    </div>
);

export const SimpleNumberViewStory = Template.bind(
    {},
    {
        number: 6488946759912.511
    }
);

export const CustomDefaultFormatterOptionsViewStory = Template.bind(
    {},
    {
        number: 1548927,
        defaultFormatterOptions: {
            style: 'currency',
            currency: 'RUB'
        }
    }
);

export const WithSameFractionalPartViewStory = (): JSX.Element => {
    const numbers = [123, 2317546731354.654, 6488946759912.511, 5990.45, 1123];

    const defaultFormatterOptions = {
        minimumFractionDigits: getMaxFractionalPartOfNumbers(numbers)
    };

    return (
        <div className={styles.templateContainer}>
            {numbers.map(number => (
                <span key={number}>
                    <FormattedNumber number={number} defaultFormatterOptions={defaultFormatterOptions} />
                </span>
            ))}
        </div>
    );
};

export const WithCustomFormatterViewStory = Template.bind(
    {},
    {
        number: 1548927,
        formatter: {
            format: number => [...number.toString()].map(digit => `${digit} `).join('')
        }
    }
);

export const WithCustomNumberPartsParserViewStory = Template.bind(
    {},
    {
        number: 1548927,
        formatter: {
            format: number => number.toString()
        },
        parseNumberToParts: numberString =>
            [...numberString].reduce((acc: Array<string>, digit, index, array) => {
                const numberPart = `${digit}${array[index + 1]}`;

                return index % 2 === 0 ? acc : [...acc, numberPart];
            }, [])
    }
);

export const WithCustomClassNamesViewStory = Template.bind(
    {},
    {
        number: 1548927,
        defaultFormatterOptions: {
            style: 'currency',
            currency: 'RUB'
        },
        numberPartsDividerClassName: styles.customSpace
    }
);

export default {
    title: 'components/FormattedNumber',
    component: FormattedNumber
};
