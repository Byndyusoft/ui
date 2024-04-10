import React from 'react';
import useDebounce from './useDebounce';
import './useDebounce.stories.css';
import type { Meta, StoryObj } from '@storybook/react';

type Story = StoryObj<typeof Template>;

const Template = () => {
    const [debouncedValue, setDebouncedValue] = useDebounce('', 2000);

    return (
        <div className="container">
            <span>
                Debounced value: <span>{debouncedValue}</span>
            </span>
            <input onChange={e => setDebouncedValue(e.target.value)} />
            <button onClick={() => setDebouncedValue('10000')}>set debounced value</button>
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
