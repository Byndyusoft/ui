import React, { useState } from 'react';
import { StoryFn } from '@storybook/react';
import useArray from './useArray';
import './useArray.stories.css';

const HookStoryComponent = () => {
    const [addValue, setAddValue] = useState(0);
    const [prependValue, setPrependValue] = useState(0);
    const [fromValue, setFromValue] = useState(0);
    const [lessValue, setLessValue] = useState(0);
    const { list, append, prepend, filter, clear, reset, sort } = useArray<number>([1, 2, 3, 4, 5]);

    return (
        <div>
            <h1>List</h1>
            <strong>{list.join(', ')}</strong>
            <hr />
            <div className="container">
                <div style={{ display: 'flex', gap: '8px', width: '500px' }}>
                    <input
                        className="leftPart"
                        value={addValue}
                        type="numeric"
                        onChange={e => setAddValue(+e.target.value)}
                    />
                    <button onClick={() => append(addValue)}>Append</button>
                </div>
                <div className="row">
                    <input
                        className="leftPart"
                        value={prependValue}
                        type="numeric"
                        onChange={e => setPrependValue(+e.target.value)}
                    />
                    <button onClick={() => prepend(prependValue)}>Prepend</button>
                </div>
                <div className="row">
                    <div className="leftPart">
                        <span>from</span>
                        <input
                            className="filterInput"
                            value={fromValue}
                            type="numeric"
                            onChange={e => setFromValue(+e.target.value)}
                        />
                        <span>to</span>
                        <input
                            className="filterInput"
                            value={lessValue}
                            type="numeric"
                            onChange={e => setLessValue(+e.target.value)}
                        />
                    </div>
                    <button onClick={() => filter(a => a >= fromValue && a <= lessValue)}>Filter</button>
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
