import React, { useState } from 'react';
import type { StoryObj } from '@storybook/react';
import useDebouncedCallback from './useDebouncedCallback';
import './useDebouncedCallback.stories.css';

const COLORS = ['red', 'green', 'yellow'];

const DebouncedColorChange = () => {
    const [firstColorIndex, setFirstColorIndex] = useState(0);
    const [secondColorIndex, setSecondColorIndex] = useState(0);
    const setDebouncedSecondColorIndex = useDebouncedCallback(setSecondColorIndex, 1000);

    return (
        <div className="use-debounced-callback__container">
            <div className="use-debounced-callback__block">
                <button
                    className="use-debounced-callback__button"
                    type="button"
                    onClick={() => setFirstColorIndex((firstColorIndex + 1) % 3)}
                >
                    Click for color change
                </button>
                <div
                    className="use-debounced-callback__rectangle"
                    style={{ backgroundColor: COLORS[firstColorIndex] }}
                />
            </div>

            <div className="use-debounced-callback__block">
                <button
                    className="use-debounced-callback__button"
                    type="button"
                    onClick={() => setDebouncedSecondColorIndex((secondColorIndex + 1) % 3)}
                >
                    Click for debounced color change (delay: 1000 ms)
                </button>
                <div
                    className="use-debounced-callback__rectangle"
                    style={{ backgroundColor: COLORS[secondColorIndex] }}
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
