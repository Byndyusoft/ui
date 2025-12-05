import React from 'react';
import { StoryObj } from '@storybook/react';
import { IFormattedNumberViewProps } from '../FormattedNumber.types';
import FormattedNumber, { getMaxFractionalPartOfNumbers } from '..';
import styles from './FormattedNumber.stories.module.css';

const Template: (args: IFormattedNumberViewProps) => JSX.Element = (args: IFormattedNumberViewProps) => (
    <div className={styles.templateContainer}>
        <span>
            <FormattedNumber {...args} />
        </span>
    </div>
);

export const SimpleNumberViewStory: StoryObj<typeof Template> = {
    name: 'Simple number view',
    render: Template,
    args: {
        number: 6488946759912.511
    }
};

export const NegativeNumberViewStory: StoryObj<typeof Template> = {
    name: 'Negative number view',
    render: Template,
    args: {
        number: -363863.397562
    }
};

export const CustomDefaultFormatterOptionsViewStory: StoryObj<typeof Template> = {
    name: 'Custom default formatter options view',
    render: Template,
    args: {
        number: 1548927,
        defaultFormatterOptions: {
            style: 'currency',
            currency: 'RUB'
        }
    }
};

const WithSameFractionalPartView = (): JSX.Element => {
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

export const WithSameFractionalPartViewStory: StoryObj<typeof WithSameFractionalPartView> = {
    name: 'With same fractional part view',
    render: WithSameFractionalPartView
};

export const WithCustomFormatterViewStory: StoryObj<typeof Template> = {
    name: 'With custom formatter view',
    render: Template,
    args: {
        number: 1548927,
        formatter: {
            format: number => [...number.toString()].map(digit => `${digit} `).join('')
        }
    }
};

export const WithCustomNumberPartsParserViewStory: StoryObj<typeof Template> = {
    name: 'With custom number parts parser view',
    render: Template,
    args: {
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
};

export const WithCustomClassNamesViewStory: StoryObj<typeof Template> = {
    name: 'With custom class names view',
    render: Template,
    args: {
        number: 1548927,
        defaultFormatterOptions: {
            style: 'currency',
            currency: 'RUB'
        },
        numberPartsDividerClassName: styles.customSpace
    }
};

export default {
    title: 'components/FormattedNumber'
};
