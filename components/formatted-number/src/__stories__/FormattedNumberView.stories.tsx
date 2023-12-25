import React from 'react';
import { Story } from '@storybook/react';
import { IFormattedNumberViewProps } from '../FormattedNumberView.types';
import FormattedNumber, { getMaxFractionalPartOfNumbers } from '..';
import styles from './FormattedNumberView.stories.module.css';

const Template: Story<IFormattedNumberViewProps> = (args: IFormattedNumberViewProps) => (
    <div className={styles.templateContainer}>
        <FormattedNumber {...args} />
    </div>
);

export const SimpleNumberViewStory = Template.bind(
    {},
    {
        number: 6488946759912.511
    }
);

export const WithSupTextFootnoteViewStory = Template.bind(
    {},
    {
        number: 123,
        footnote: {
            type: FormattedNumber.footnoteTypes.SUP_TEXT,
            value: '*'
        }
    }
);

export const WithSmallSupTextFootnoteViewStory = Template.bind(
    {},
    {
        number: 1354,
        footnote: {
            type: FormattedNumber.footnoteTypes.SUP_TEXT,
            value: '+10',
            valueSizeModifier: FormattedNumber.footnoteValueSizeMods.SMALLER
        }
    }
);

export const WithParenthesesFootnoteViewStory = Template.bind(
    {},
    {
        number: 1548927,
        footnote: {
            type: FormattedNumber.footnoteTypes.PARENTHESES
        }
    }
);

export const CustomFormatterOptionsViewStory = Template.bind(
    {},
    {
        number: 1548927,
        formatterOptions: {
            style: 'currency',
            currency: 'RUB'
        }
    }
);

export const WithSameFractionalPartViewStory: Story = () => {
    const numbers = [123, 2317546731354.654, 6488946759912.511, 5990.45, 1123];

    const formatterOptions = {
        minimumFractionDigits: getMaxFractionalPartOfNumbers(numbers)
    };

    return (
        <div className={styles.templateContainer}>
            {numbers.map(number => (
                <FormattedNumber key={number} number={number} formatterOptions={formatterOptions} />
            ))}
        </div>
    );
};

export const WithCustomClassNamesViewStory = Template.bind(
    {},
    {
        number: 1548927,
        formatterOptions: {
            style: 'currency',
            currency: 'RUB'
        },
        footnote: {
            type: FormattedNumber.footnoteTypes.SUP_TEXT,
            value: '+10',
            valueSizeModifier: FormattedNumber.footnoteValueSizeMods.SMALLER
        },
        classNames: {
            container: styles.customContainer,
            number: styles.customNumber,
            space: styles.customSpace,
            footnote: styles.customFootnote,
        }
    }
);
