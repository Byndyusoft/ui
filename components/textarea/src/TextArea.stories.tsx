import React, { ChangeEvent, useRef, useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import TextArea from './TextArea';
import { ITextAreaProps } from './TextArea.types';

const meta = {
    title: 'components/TextArea',
    component: TextArea,
    args: {
        isDisabled: false,
        minHeight: 30,
        placeholder: 'Type text',
        withAutoHeight: false,
        onChange: fn(),
        onStopChanging: fn()
    },
    argTypes: {
        onChange: {
            control: false
        },
        onStopChanging: {
            control: false
        }
    }
} satisfies Meta<typeof TextArea>;

export default meta;

type TStory = StoryObj<typeof TextArea>;

export const Default: TStory = {};

const PlaygroundComponent = (args: ITextAreaProps): JSX.Element => {
    const [value, setValue] = useState('');
    const ref = useRef<HTMLTextAreaElement>(null);

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>): void => {
        setValue(event.target.value);
        args.onChange?.(event);
    };

    const handleSetFocus = (): void => {
        ref.current?.focus();
    };

    const handleSetValue = (): void => {
        setValue('some text');
    };

    return (
        <div style={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column', gap: 16 }}>
            <span>{`value: ${value}`}</span>

            <TextArea {...args} ref={ref} value={value} onChange={handleChange} />

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <button type="button" onClick={handleSetFocus}>
                    Set focus
                </button>

                <button type="button" onClick={handleSetValue}>
                    Set value
                </button>
            </div>
        </div>
    );
};

export const Playground: TStory = {
    render: args => <PlaygroundComponent {...args} />
};
