import React, { useCallback, useState } from 'react';
import { Story } from '@storybook/react';
import RadioGroup from '../components/RadioGroup';
import Radio from '../components/Radio';
import CustomRadioComponent from './CustomRadio';

const DefaultStory: Story = () => {
    const [value, setValue] = useState('apple');

    return (
        <div>
            <strong>Fruit: {value}</strong>
            <RadioGroup initialValue={value} name="fruit" onChange={setValue}>
                <Radio value="apple">🍎 Apple</Radio>
                <Radio value="banana">🍌 Banana</Radio>
                <Radio value="pineapple">🍍 Pineapple</Radio>
            </RadioGroup>
        </div>
    );
};

export const Default = DefaultStory.bind({});

const WithCustomRadioStory: Story = () => {
    const [value, setValue] = useState('happy');

    return (
        <div>
            <strong>Mood: {value}</strong>
            <RadioGroup initialValue={value} name="mood" onChange={setValue}>
                <CustomRadioComponent value="happy">😊 Happy</CustomRadioComponent>
                <CustomRadioComponent value="neutral">😐 Neutral</CustomRadioComponent>
                <CustomRadioComponent value="upset">😔 Upset</CustomRadioComponent>
            </RadioGroup>
        </div>
    );
};

export const WithCustomRadio = WithCustomRadioStory.bind({});

export default {
    title: 'components/RadioGroup',
    component: RadioGroup
};
