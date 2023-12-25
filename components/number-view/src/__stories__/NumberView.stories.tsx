import React from 'react';
import { Story } from '@storybook/react';
import { INumberViewProps } from '../NumberView.types';
import NumberView, { getMaxFractionalPartOfNumbers } from '..';
import styles from './NumberView.stories.module.css';

const Template: Story<INumberViewProps> = (args: INumberViewProps) => (
    <div className={styles.templateContainer}>
        <NumberView {...args} />
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
            type: NumberView.footnoteTypes.SUP_TEXT,
            value: '*'
        }
    }
);

export const WithSmallSupTextFootnoteViewStory = Template.bind(
    {},
    {
        number: 1354,
        footnote: {
            type: NumberView.footnoteTypes.SUP_TEXT,
            value: '+10',
            valueSizeModifier: NumberView.footnoteValueSizeMods.SMALLER
        }
    }
);

export const WithParenthesesFootnoteViewStory = Template.bind(
    {},
    {
        number: 1548927,
        footnote: {
            type: NumberView.footnoteTypes.PARENTHESES
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
                <NumberView key={number} number={number} formatterOptions={formatterOptions} />
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
            type: NumberView.footnoteTypes.SUP_TEXT,
            value: '+10',
            valueSizeModifier: NumberView.footnoteValueSizeMods.SMALLER
        },
        classNames: {
            container: styles.customContainer,
            number: styles.customNumber,
            space: styles.customSpace,
            footnote: styles.customFootnote,
        }
    }
);
