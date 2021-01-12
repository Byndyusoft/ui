import React, { useState, useRef } from 'react';
import { action } from '@storybook/addon-actions';
import { Meta } from '@storybook/react';
import TextInput from '../TextInput';
import '../TextInput/TextInput.css';

export const DefaultTextInputStory = () => {
    const [inputValue, setInputValue] = useState<string>('');

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    return (
        <form
            onSubmit={e => {
                e.preventDefault();
            }}
        >
            <TextInput name="default-story-input" value={inputValue} onChange={onChangeHandler} />
            <p>Input value: {inputValue}</p>
        </form>
    );
};

export const UncontrolledTextInputStory = () => {
    const inputRef = useRef<HTMLInputElement>();

    return (
        <form
            onSubmit={e => {
                e.preventDefault();
                if (inputRef.current) {
                    action('onSubmit input value')(inputRef.current.value);
                }
            }}
        >
            <div>
                <TextInput
                    inputRef={ref => {
                        if (ref) {
                            inputRef.current = ref;
                        }
                    }}
                    name="uncontrolled-story-input"
                    defaultValue={''}
                />
            </div>
            <br />
            <div>
                <input type="submit" value="OK" />
            </div>
            <div>
                <br />
                <i>Check actions for result</i>
            </div>
        </form>
    );
};

DefaultTextInputStory.storyName = 'Default';
UncontrolledTextInputStory.storyName = 'Uncontrolled';

const meta: Meta = {
    title: 'Components/TextInput',
    component: TextInput
};

export default meta;