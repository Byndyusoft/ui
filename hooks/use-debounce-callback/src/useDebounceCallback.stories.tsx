import React, { useState } from 'react';
import useDebounceCallback from './useDebounceCallback';
import './useDebounceCallback.stories.css';
import type { Meta, StoryObj } from '@storybook/react';

type Story = StoryObj<typeof Template>;

const oldValue = 'old value';
const newValue = 'new value';
const timeout = 2000;

const Template = () => {
    const [value, setValue] = useState(oldValue);
    const setDebounceValue = useDebounceCallback(setValue, timeout);

    return (
        <div className="container">
            <span>Value: {value}</span>
            <button onClick={() => setDebounceValue(newValue)}>debounced change</button>
            <button onClick={() => setValue(newValue)}>change</button>
            <button onClick={() => setValue(oldValue)}>reset</button>
        </div>
    );
};

export const HookStory: Story = {
    decorators: [() => <Template />]
};

const meta: Meta<typeof Template> = {
    title: 'hooks/useDebounceCallback',
    component: Template
};

export default meta;
