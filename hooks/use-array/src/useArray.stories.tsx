import React, { useState } from 'react';
import { StoryObj } from '@storybook/react';
import useArray from './useArray';
import styles from './useArray.stories.module.css';

const Template = (): JSX.Element => {
    const [addValue, setAddValue] = useState(0);
    const [prependValue, setPrependValue] = useState(0);
    const [fromValue, setFromValue] = useState(0);
    const [lessValue, setLessValue] = useState(0);
    const [indexUpdateValue, setIndexUpdateValue] = useState(0);
    const [updateValue, setUpdateValue] = useState(0);
    const [indexRemoveValue, setIndexRemoveValue] = useState(0);
    const [list, { append, prepend, update, remove, filter, clear, reset, sort }] = useArray<number>([1, 2, 3, 4, 5]);

    return (
        <div>
            <h1>List</h1>
            <strong>{list.length > 0 ? list.join(', ') : 'Empty'}</strong>
            <hr />
            <div className={styles.container}>
                <div className={styles.row}>
                    <input
                        className={styles.input}
                        value={addValue}
                        type="numeric"
                        onChange={e => setAddValue(Number(e.target.value))}
                    />
                    <button
                        className={styles.button}
                        type="button"
                        onClick={() => append(addValue)}
                    >
                        Append
                    </button>
                </div>
                <div className={styles.row}>
                    <input
                        className={styles.input}
                        value={prependValue}
                        type="numeric"
                        onChange={e => setPrependValue(Number(e.target.value))}
                    />
                    <button
                        className={styles.button}
                        onClick={() => prepend(prependValue)}
                    >
                        Prepend
                    </button>
                </div>
                <div className={styles.row}>
                    <span>from</span>
                    <input
                        className={styles.input}
                        value={fromValue}
                        type="numeric"
                        onChange={e => setFromValue(Number(e.target.value))}
                    />
                    <span>to</span>
                    <input
                        className={styles.input}
                        value={lessValue}
                        type="numeric"
                        onChange={e => setLessValue(Number(e.target.value))}
                    />
                    <button
                        className={styles.button}
                        onClick={() => filter(a => a >= fromValue && a <= lessValue)}
                    >
                        Filter
                    </button>
                </div>
                <div className={styles.row}>
                    <span>index</span>
                    <input
                        className={styles.input}
                        value={indexUpdateValue}
                        type="numeric"
                        onChange={e => setIndexUpdateValue(Number(e.target.value))}
                    />
                    <span>item</span>
                    <input
                        className={styles.input}
                        value={updateValue}
                        type="numeric"
                        onChange={e => setUpdateValue(Number(e.target.value))}
                    />
                    <button
                        className={styles.button}
                        onClick={() => update(indexUpdateValue, updateValue)}
                    >
                        Update
                    </button>
                </div>
                <div className={styles.row}>
                    <input
                        className={styles.input}
                        value={indexRemoveValue}
                        type="numeric"
                        onChange={e => setIndexRemoveValue(Number(e.target.value))}
                    />
                    <button
                        className={styles.button}
                        onClick={() => remove(indexRemoveValue)}
                    >
                        Remove
                    </button>
                </div>
                <div className={styles.row}>
                    <button
                        className={styles.button}
                        type="button"
                        onClick={() => reset()}
                    >
                        Reset
                    </button>
                    <button
                        className={styles.button}
                        type="button"
                        onClick={() => clear()}
                    >
                        Clear
                    </button>
                    <button
                        className={styles.button}
                        type="button"
                        onClick={() => sort((a, b) => a - b)}
                    >
                        Sort ASC
                    </button>
                    <button
                        className={styles.button}
                        type="button"
                        onClick={() => sort((a, b) => b - a)}
                    >
                        Sort DES
                    </button>
                </div>
            </div>
        </div>
    );
};

export const HookStory: StoryObj<typeof Template> = {
    name: 'Hook story',
    render: Template
}

export default {
    title: 'hooks/useArray'
};
