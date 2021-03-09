import React from 'react';
import { Meta, Story } from '@storybook/react';
import Checkbox from './Checkbox';

export const CheckboxStory: Story = () => {
    const [isChecked, setChecked] = React.useState<boolean>(false);

    return (
        <>
            <h1>Checkbox</h1>
            <Checkbox
                isChecked={isChecked}
                onChange={(event, checked) => {
                    setChecked(checked);
                }}
                name="story-checkbox"
            >
                Click to check
            </Checkbox>
            <Checkbox name="disabled" isDisabled isIndeterminate>
                I am Disabled and Indeterminate
            </Checkbox>
            <Checkbox name="disabled-checked" isChecked isDisabled>
                I am Disabled too
            </Checkbox>
        </>
    );
};

CheckboxStory.storyName = 'Checkbox';

const meta: Meta = {
    title: 'Checkbox',
    component: Checkbox
};

export default meta;
