import React, { useState } from 'react';
import { StoryObj } from '@storybook/react';
import useDebouncedValue from './useDebouncedValue';
import styles from './useDebouncedValue.stories.module.css';

const DebouncedInput = () => {
    const [delay, setDelay] = useState(1000);
    const [debouncedValue, setDebouncedValue] = useDebouncedValue('', delay);

    return (
        <div className={styles.container}>
            <div className={styles.block}>
                <span className={styles.title}>Delay:</span>
                <button
                    className={styles.button}
                    type="button"
                    disabled={delay <= 0}
                    onClick={() => setDelay(delay - 100)}
                >
                    -
                </button>

                <span>{`${delay} ms`}</span>

                <button className={styles.button} type="button" onClick={() => setDelay(delay + 100)}>
                    +
                </button>
            </div>

            <div className={styles.block}>
                <span className={styles.title}>Type anything:</span>
                <input className={styles.input} onChange={e => setDebouncedValue(e.target.value)} />
            </div>

            <div className={styles.divider} />

            <div className={styles.block}>
                <span className={styles.title}>Debounced result:</span>
                <span>{debouncedValue}</span>
            </div>
        </div>
    );
};

export const DebouncedInputStory: StoryObj<typeof DebouncedInput> = {
    name: 'Debounced input',
    render: DebouncedInput
};

export default {
    title: 'hooks/useDebouncedValue'
};
