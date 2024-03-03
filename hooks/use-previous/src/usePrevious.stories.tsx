import React, { useState } from 'react';
import usePrevious from './usePrevious';
import type { Meta, StoryObj } from '@storybook/react';
import './usePrevious.stories.css';

type TStory = StoryObj<typeof Template>;

const Template = (): JSX.Element => {
    const [counter, setCounter] = useState(0);
    const res = usePrevious(counter);

    return (
        <>
            <button type="button" onClick={() => setCounter(counter + 1)}>
                Update value
            </button>
            <div className="container">
                <span>Previous value: {res}</span>
                <span>Current value: {counter}</span>
            </div>
        </>
    );
};

export const HookStory: TStory = {
    decorators: [(): JSX.Element => <Template />]
};

const meta: Meta<typeof Template> = {
    title: 'hooks/usePrevious'
    // component: Template
};

export default meta;
