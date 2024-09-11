import React from 'react';
import { Story } from '@storybook/react';
import RadioGroup from '../components/RadioGroup';
import Radio from '../components/Radio';
import CustomRadioComponent from './CustomRadio';

const DefaultStory: Story = () => (
    <div>
        <strong>Fruit</strong>
        <RadioGroup value="apple" name="fruit">
            <Radio value="apple">🍎 Apple</Radio>
            <Radio value="banana">🍌 Banana</Radio>
            <Radio value="pineapple">🍍 Pineapple</Radio>
        </RadioGroup>
    </div>
);

export const Default = DefaultStory.bind({});

const WithCustomRadioStory: Story = () => (
    <div>
        <strong>Mood</strong>
        <RadioGroup value="happy" name="mood">
            <CustomRadioComponent value="happy">😊 Happy</CustomRadioComponent>
            <CustomRadioComponent value="neutral">😐 Neutral</CustomRadioComponent>
            <CustomRadioComponent value="upset">😔 Upset</CustomRadioComponent>
        </RadioGroup>
    </div>
);

export const WithCustomRadio = WithCustomRadioStory.bind({});

export default {
    title: 'components/RadioGroup',
    component: RadioGroup
};
