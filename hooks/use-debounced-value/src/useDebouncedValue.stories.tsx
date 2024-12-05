import React, { useState } from 'react';
import { StoryObj } from '@storybook/react';
import useDebouncedValue from './useDebouncedValue';
import './useDebouncedValue.stories.css';

const DebouncedInput = () => {
    const [delay, setDelay] = useState(1000);
    const [debouncedValue, setDebouncedValue] = useDebouncedValue('', delay);

    return (
        <div className="use-debounced-value__container">
            <div className="use-debounced-value__block">
                <span className="use-debounced-value__title">Delay:</span>
                <button
                    className="use-debounced-value__button"
                    type="button"
                    disabled={delay <= 0}
                    onClick={() => setDelay(delay - 100)}
                >-</button>

                <span>{`${delay} ms`}</span>

                <button
                    className="use-debounced-value__button"
                    type="button"
                    onClick={() => setDelay(delay + 100)}
                >+</button>
            </div>

            <div className="use-debounced-value__block">
                <span className="use-debounced-value__title">Type anything:</span>
                <input className="use-debounced-value__input" onChange={e => setDebouncedValue(e.target.value)} />
            </div>

            <div className="use-debounced-value__divider" />

            <div className="use-debounced-value__block">
                <span className="use-debounced-value__title">Debounced result:</span>
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
