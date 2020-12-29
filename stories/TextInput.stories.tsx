import { useState } from 'react';
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

DefaultTextInputStory.storyName = 'Default';

const meta: Meta = {
    title: 'Components/TextInput',
    component: TextInput
};

export default meta;
