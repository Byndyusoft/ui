import React, { ChangeEvent, useRef, useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ITextAreaProps } from './TextArea.types';
import TextArea from './TextArea';
import styles from './TextArea.stories.module.css';

const meta = {
    title: 'components/TextArea',
    component: TextArea,
    args: {
        isDisabled: false,
        minHeight: 40,
        placeholder: 'Type text',
        withAutoHeight: false,
        className: styles.textarea,
        changingDelay: 2000,
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

    const [isContentWide, setIsContentWide] = useState(false);

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>): void => {
        setValue(event.target.value);
        args.onChange?.(event);
    };

    const handleSetValue = (): void => {
        setValue(
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Culpa dignissimos laudantium quas quod ratione sit voluptatibus.'
        );
    };

    const handleSetFocus = (): void => {
        ref.current?.focus();
    };

    const handleChangeContentSize = (): void => {
        setIsContentWide(prevState => !prevState);
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <TextArea
                    {...args}
                    className={isContentWide ? `${args.className} ${styles.textareaWide}` : args.className}
                    ref={ref}
                    value={value}
                    onChange={handleChange}
                />
            </div>

            <div className={styles.panel}>
                <button type="button" className={styles.button} onClick={handleSetValue}>
                    Set value
                </button>
                <button type="button" className={styles.button} onClick={handleSetFocus}>
                    Set focus
                </button>
                <button type="button" className={styles.button} onClick={handleChangeContentSize}>
                    {isContentWide ? 'Set short' : 'Set wide'}
                </button>
            </div>
        </div>
    );
};

export const Playground: TStory = {
    render: args => <PlaygroundComponent {...args} />
};
