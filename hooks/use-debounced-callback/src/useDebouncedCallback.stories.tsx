import React, { useState } from 'react';
import type { StoryObj } from '@storybook/react';
import useDebouncedCallback from './useDebouncedCallback';
import styles from './useDebouncedCallback.stories.module.css';

const COLORS = ['red', 'green', 'yellow'];

const DebouncedColorChange = () => {
    const [firstColorIndex, setFirstColorIndex] = useState(0);
    const [secondColorIndex, setSecondColorIndex] = useState(0);
    const setDebouncedSecondColorIndex = useDebouncedCallback(setSecondColorIndex, 1000);

    return (
        <div className={styles.container}>
            <div className={styles.block}>
                <button
                    className={styles.button}
                    type="button"
                    onClick={() => setFirstColorIndex((firstColorIndex + 1) % 3)}
                >
                    Click for color change
                </button>
                <div className={styles.rectangle} style={{ backgroundColor: COLORS[firstColorIndex] }} />
            </div>

            <div className={styles.block}>
                <button
                    className={styles.button}
                    type="button"
                    onClick={() => setDebouncedSecondColorIndex((secondColorIndex + 1) % 3)}
                >
                    Click for debounced color change (delay: 1000 ms)
                </button>
                <div className={styles.rectangle} style={{ backgroundColor: COLORS[secondColorIndex] }} />
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
