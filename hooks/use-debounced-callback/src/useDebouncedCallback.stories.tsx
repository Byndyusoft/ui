import React, { useState } from 'react';
import type { StoryObj } from '@storybook/react';
import useDebouncedCallback from './useDebouncedCallback';
import './useDebouncedCallback.stories.css';

const COLORS = ['red', 'green', 'yellow'];

const DebouncedColorChange = () => {
    const [colorIndexOne, setColorIndexOne] = useState(0);
    const [colorIndexTwo, setColorIndexTwo] = useState(0);
    const setDebouncedColorIndexTwo = useDebouncedCallback(setColorIndexTwo, 1000);

    return (
        <div className="use-debounced-callback__container">
            <div className="use-debounced-callback__block">
                <button
                    className="use-debounced-callback__button"
                    type="button"
                    onClick={() => setColorIndexOne((colorIndexOne + 1) % 3)}
                >
                    Click for color change
                </button>
                <div
                    className="use-debounced-callback__rectangle"
                    style={{ backgroundColor: COLORS[colorIndexOne] }}
                />
            </div>

            <div className="use-debounced-callback__block">
                <button
                    className="use-debounced-callback__button"
                    type="button"
                    onClick={() => setDebouncedColorIndexTwo((colorIndexTwo + 1) % 3)}
                >
                    Click for debounced color change (delay: 1000 ms)
                </button>
                <div
                    className="use-debounced-callback__rectangle"
                    style={{ backgroundColor: COLORS[colorIndexTwo] }}
                />
            </div>
        </div>
    );
};

export const DebouncedColorChangeStory: StoryObj<typeof DebouncedColorChange> = {
    name: 'Debounced color change',
    render: DebouncedColorChange
};

export default {
    title: 'hooks/useDebouncedCallback'
};
