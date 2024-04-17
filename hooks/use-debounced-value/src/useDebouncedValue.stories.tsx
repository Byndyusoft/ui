import React from 'react';
import useDebouncedValue from './useDebouncedValue';
import './useDebouncedValue.stories.css';
import type { Meta, StoryObj } from '@storybook/react';

type Story = StoryObj<typeof Template>;

const Template = () => {
    const [debouncedValue, setDebouncedValue] = useDebouncedValue('', 2000);

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
    title: 'hooks/useDebouncedValue',
    component: Template
};

export default meta;
