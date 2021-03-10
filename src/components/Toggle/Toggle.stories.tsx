import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import Toggle from './Toggle';

export const DefaultToggleStory: Story = () => {
    const [isToggled, setToggeled] = useState<boolean>(false);

    return (
        <>
            <h1>Default</h1>
            <Toggle checked={isToggled} onToggle={setToggeled} />
        </>
    );
};

DefaultToggleStory.storyName = 'Default Toggle';

export const DisabledToggleStory: Story = () => {
    const [isToggled, setToggeled] = useState<boolean>(false);

    return (
        <>
            <h1>Disabled</h1>
            <Toggle checked={isToggled} onToggle={setToggeled} isDisabled />
        </>
    );
};

DisabledToggleStory.storyName = 'Disabled Toggle';

const meta: Meta = {
    title: 'components/Toggle',
    component: Toggle
};

export default meta;
