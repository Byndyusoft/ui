import React, { useState } from 'react';
import { StoryFn } from '@storybook/react';
import useArray from './useArray';
import './useArray.stories.css';

const HookStoryComponent = () => {
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
            <div className="container">
                <div className="row">
                    <input
                        className="input"
                        value={addValue}
                        type="numeric"
                        onChange={e => setAddValue(+e.target.value)}
                    />
                    <button onClick={() => append(addValue)}>Append</button>
                </div>
                <div className="row">
                    <input
                        className="input"
                        value={prependValue}
                        type="numeric"
                        onChange={e => setPrependValue(+e.target.value)}
                    />
                    <button onClick={() => prepend(prependValue)}>Prepend</button>
                </div>
                <div className="row">
                    <span>from</span>
                    <input
                        className="input"
                        value={fromValue}
                        type="numeric"
                        onChange={e => setFromValue(+e.target.value)}
                    />
                    <span>to</span>
                    <input
                        className="input"
                        value={lessValue}
                        type="numeric"
                        onChange={e => setLessValue(+e.target.value)}
                    />
                    <button onClick={() => filter(a => a >= fromValue && a <= lessValue)}>Filter</button>
                </div>
                <div className="row">
                    <span>index</span>
                    <input
                        className="input"
                        value={indexUpdateValue}
                        type="numeric"
                        onChange={e => setIndexUpdateValue(+e.target.value)}
                    />
                    <span>item</span>
                    <input
                        className="input"
                        value={updateValue}
                        type="numeric"
                        onChange={e => setUpdateValue(+e.target.value)}
                    />
                    <button onClick={() => update(indexUpdateValue, updateValue)}>Update</button>
                </div>
                <div className="row">
                    <input
                        className="input"
                        value={indexRemoveValue}
                        type="numeric"
                        onChange={e => setIndexRemoveValue(+e.target.value)}
                    />
                    <button onClick={() => remove(indexRemoveValue)}>Remove</button>
                </div>
                <div className="row">
                    <button onClick={() => reset()}>Reset</button>
                    <button onClick={() => clear()}>Clear</button>
                    <button onClick={() => sort((a, b) => a - b)}>Sort ASC</button>
                    <button onClick={() => sort((a, b) => b - a)}>Sort DES</button>
                </div>
            </div>
        </div>
    );
};

const Template: StoryFn = args => <HookStoryComponent />;

export const HookStory = Template.bind({});

HookStory.args = {};

export default {
    title: 'hooks/useArray'
};
