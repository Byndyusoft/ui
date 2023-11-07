import React from 'react';
import { Story } from '@storybook/react';
import { INumberViewProps } from '../NumberView.types';
import NumberView from '../NumberView';
import styles from './NumberView.stories.module.css';

const Template: Story<INumberViewProps> = (args: INumberViewProps) => (
    <div className={styles.templateContainer}>
        <NumberView {...args} />
    </div>
);

export const SimpleNumbersViewStory = Template.bind(
    {},
    {
        numbersData: [
            { number: 123 },
            { number: 2317546731354.654 },
            { number: 6488946759912.511 },
            { number: 5990.45 },
            { number: 1123 }
        ]
    }
);

export const InlineNumbersViewStory = Template.bind(
    {},
    {
        numbersData: [
            { number: 123 },
            { number: 2317546731354.654 },
            { number: 6488946759912.511 },
            { number: 5990.45 },
            { number: 1123 }
        ],
        className: styles.inlineNumbersIndent,
        shouldRenderInline: true
    }
);

export const NumbersWithFootnotesViewStory = Template.bind(
    {},
    {
        numbersData: [
            { number: 12 },
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
                number: 1548927,
                footnote: {
                    type: NumberView.footnoteTypes.PARENTHESES
                }
            }
        ]
    }
);

export const FormatterCustomOptionsViewStory = Template.bind(
    {},
    {
        numbersData: [{ number: 12 }, { number: 0 }, { number: 123 }, { number: 1354 }, { number: 1548927 }],
        formatterOptions: {
            style: 'currency',
            currency: 'RUB'
        }
    }
);
