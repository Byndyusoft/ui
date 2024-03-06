import React, { useState } from 'react';
import useDebounce from './useDebounce';
import './useDebounce.stories.css';
import type { Meta, StoryObj } from '@storybook/react';

type Story = StoryObj<typeof Template>;

const Template = () => {
    const [value, setValue] = useState('');
    const [debouncedValue, isReady] = useDebounce(value, 2000);
    const isReadyText = 'true';
    const isNotReadyText = 'false';

    return (
        <div className="container">
            <span>
                Debounced value: <span>{debouncedValue}</span>
            </span>
            <span>Debounced value is ready: {isReady ? isReadyText : isNotReadyText}</span>
            <input value={value} onChange={e => setValue(e.target.value)} />
        </div>
    );
};

export const HookStory: Story = {
    decorators: [() => <Template />]
};

const meta: Meta<typeof Template> = {
    title: 'hooks/useDebounce',
    component: Template
};

export default meta;
