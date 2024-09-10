import React from 'react';
import cn from 'classnames';
import { Story } from '@storybook/react';
import RadioGroup from './components/RadioGroup';
import Radio from './components/Radio';

import { ReactComponent as DotsIconSVG } from './assets/circle_dots.svg';
import { ReactComponent as QuestionIconSVG } from './assets/circle_question.svg';
import { ReactComponent as InformationIconSVG } from './assets/circle_information.svg';

const DefaultStory: Story = () => (
    <div>
        <RadioGroup value="apple" name="fruit">
            <Radio value="apple" label="🍎 Apple" />
            <Radio value="banana" label="🍌 Banana" />
            <Radio value="pineapple" label="🍍 Pineapple" />
        </RadioGroup>
    </div>
);

export const Default = DefaultStory.bind({});

export default {
    title: 'components/RadioGroup',
    component: RadioGroup
};
