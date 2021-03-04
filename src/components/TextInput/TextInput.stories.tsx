import React, { useState, useRef } from 'react';
import { action } from '@storybook/addon-actions';
import { Meta, Story } from '@storybook/react';
import TextInput from '.';
import './TextInput.css';

export const DefaultTextInputStory: Story = () => {
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
            <TextInput
                name="default-story-input"
                value={inputValue}
                onChange={onChangeHandler}
                onClear={() => {
                    setInputValue('');
                }}
            />
            <p>Input value: {inputValue}</p>
        </form>
    );
};

export const UncontrolledTextInputStory: Story = () => {
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
                    defaultValue=""
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

export const InvalidInput: Story = () => {
    const [inputValue, setInputValue] = useState<string>('Test');

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setInputValue(e.target.value);
    };

    return (
        <TextInput
            name="invalidInput"
            value={inputValue}
            onChange={onChangeHandler}
            onClear={() => {
                setInputValue('');
            }}
            isInvalid={true}
            error="Неверное значение"
        />
    );
};

DefaultTextInputStory.storyName = 'Default';
UncontrolledTextInputStory.storyName = 'Uncontrolled';
InvalidInput.storyName = 'Invalid';

const meta: Meta = {
    title: 'Components/TextInput',
    component: TextInput
};

export default meta;
