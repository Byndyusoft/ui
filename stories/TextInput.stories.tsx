import { useState, useRef } from 'react';
import { action } from '@storybook/addon-actions';
import { Meta } from '@storybook/react';
import TextInput from '../src/components/TextInput';
import '../src/components/TextInput/TextInput.css';

export const DefaultTextInputStory = () => {
    const [inputValue, setInputValue] = useState<string>('');

    return (
        <form
            onSubmit={e => {
                e.preventDefault();
            }}
        >
            <TextInput name="default-story-input" value={inputValue} onChange={setInputValue} />
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
                action('onSubmit input value')(inputRef.current.value);
            }}
        >
            <TextInput
                inputRef={ref => {
                    if (ref) {
                        inputRef.current = ref;
                    }
                }}
                name="uncontrolled-story-input"
                defaultValue={''}
            />
        </form>
    );
};

DefaultTextInputStory.storyName = 'Default';

const meta: Meta = {
    title: 'Components/TextInput',
    component: TextInput
};

export default meta;
