import React, { ChangeEvent, useRef, useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ITextInputProps } from './TextInput.types';
import TextInput from './TextInput';

const meta = {
    title: 'components/TextInput',
    component: TextInput,
    args: {
        type: 'text',
        isDisabled: false,
        debounceDelay: 2000,
        throttleDelay: 1000,
        placeholder: 'Введите текст',
        'aria-label': 'Название',
        onChange: fn()
    },
    argTypes: {
        onChange: { control: false },
        onDebouncedChange: { control: false },
        onThrottledChange: { control: false }
    }
} satisfies Meta<typeof TextInput>;

export default meta;

type TStory = StoryObj<typeof TextInput>;

export const Default: TStory = { name: 'По умолчанию' };

const PlaygroundComponent = (args: ITextInputProps): JSX.Element => {
    const [value, setValue] = useState('');
    const [debounced, setDebounced] = useState({ value: '', count: 0 });
    const [throttled, setThrottled] = useState({ value: '', count: 0 });
    const ref = useRef<HTMLInputElement>(null);

    const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setValue(event.target.value);
        args.onChange?.(event);
    };

    const handleDebouncedChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const nextValue = event.target.value;
        setDebounced(previous => ({ value: nextValue, count: previous.count + 1 }));
        args.onDebouncedChange?.(event);
    };

    const handleThrottledChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const nextValue = event.target.value;
        setThrottled(previous => ({ value: nextValue, count: previous.count + 1 }));
        args.onThrottledChange?.(event);
    };

    return (
        <div>
            <TextInput
                {...args}
                ref={ref}
                value={value}
                onChange={handleChange}
                onDebouncedChange={args.onDebouncedChange ? handleDebouncedChange : undefined}
                onThrottledChange={args.onThrottledChange ? handleThrottledChange : undefined}
            />
            <button type="button" onClick={() => setValue('Программное значение')}>
                Установить текст
            </button>
            <button type="button" onClick={() => ref.current?.focus()}>
                Установить фокус
            </button>
            {args.onDebouncedChange && (
                <p aria-live="polite">
                    После паузы — вызовов: {debounced.count}; значение: {debounced.value || '—'}
                </p>
            )}
            {args.onThrottledChange && (
                <p aria-live="polite">
                    С ограничением частоты — вызовов: {throttled.count}; значение: {throttled.value || '—'}
                </p>
            )}
        </div>
    );
};

export const Playground: TStory = {
    name: 'Проверка параметров',
    render: args => <PlaygroundComponent {...args} />
};

export const Debounced: TStory = {
    name: 'Коллбек после паузы',
    args: { onDebouncedChange: fn(), debounceDelay: 600 },
    render: args => <PlaygroundComponent {...args} />
};

export const Throttled: TStory = {
    name: 'Ограничение частоты коллбека',
    args: { onThrottledChange: fn(), throttleDelay: 400 },
    render: args => <PlaygroundComponent {...args} />
};

export const Combined: TStory = {
    name: 'Совместная работа',
    args: {
        onDebouncedChange: fn(),
        debounceDelay: 600,
        onThrottledChange: fn(),
        throttleDelay: 400
    },
    render: args => <PlaygroundComponent {...args} />
};
