import React, { useState } from 'react';
import { StoryObj } from '@storybook/react';
import useDebouncedValue from './useDebouncedValue';
import './useDebouncedValue.stories.css';

const DebouncedInput = () => {
    const [delay, setDelay] = useState(1000);
    const [debouncedValue, setDebouncedValue] = useDebouncedValue('', delay);

    return (
        <div className="container">
            <div className="block">
                <span className="title">Delay:</span>
                <button
                    className="button"
                    type="button"
                    disabled={delay <= 0}
                    onClick={() => setDelay(delay - 100)}
                >-</button>

                <span>{`${delay} ms`}</span>

                <button
                    className="button"
                    type="button"
                    onClick={() => setDelay(delay + 100)}
                >+</button>
            </div>

            <div className="block">
                <span className="title">Type anything:</span>
                <input className="input" onChange={e => setDebouncedValue(e.target.value)} />
            </div>

            <div className="divider" />

            <div className="block">
                <span className="title">Debounced result:</span>
                <span>{debouncedValue}</span>
            </div>
        </div>
    );
};

export const DebouncedInputStory : StoryObj<typeof DebouncedInput> = {
    name: 'Debounced input',
    render: DebouncedInput
};

export default {
    title: 'hooks/useDebouncedValue'
};
