import React, { ChangeEvent, useRef, useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ITextAreaProps } from './TextArea.types';
import TextArea from './TextArea';
import styles from './TextArea.stories.module.css';

const meta = {
    title: 'components/TextArea',
    component: TextArea,
    parameters: {
        actions: { argTypesRegex: '^onChange$' }
    },
    args: {
        isDisabled: false,
        withAutoHeight: false,
        debounceDelay: 2000,
        throttleDelay: 1000,
        placeholder: 'Введите текст',
        className: styles.textarea,
        onChange: fn()
    },
    argTypes: {
        onChange: {
            control: false
        },
        onDebouncedChange: {
            control: false
        },
        onThrottledChange: {
            control: false
        }
    }
} satisfies Meta<typeof TextArea>;

export default meta;

type TStory = StoryObj<typeof TextArea>;

export const Default: TStory = { name: 'По умолчанию' };

const PlaygroundComponent = (args: ITextAreaProps): JSX.Element => {
    const [value, setValue] = useState('');
    const [debounced, setDebounced] = useState({ value: '', count: 0 });
    const [throttled, setThrottled] = useState({ value: '', count: 0 });
    const ref = useRef<HTMLTextAreaElement>(null);

    const [isContentWide, setIsContentWide] = useState(false);

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>): void => {
        setValue(event.target.value);
        args.onChange?.(event);
    };

    const handleSetValue = (): void => {
        setValue(
            'Этот текст установлен программно. Высота поля подстраивается под содержимое, а отложенные коллбеки запускаются только после пользовательского ввода.'
        );
    };

    const handleDebouncedChange = (event: ChangeEvent<HTMLTextAreaElement>): void => {
        const nextValue = event.target.value;
        setDebounced(previous => ({ value: nextValue, count: previous.count + 1 }));
        args.onDebouncedChange?.(event);
    };

    const handleThrottledChange = (event: ChangeEvent<HTMLTextAreaElement>): void => {
        const nextValue = event.target.value;
        setThrottled(previous => ({ value: nextValue, count: previous.count + 1 }));
        args.onThrottledChange?.(event);
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
                    className={isContentWide ? `${args.className ?? ''} ${styles.textareaWide}` : args.className}
                    ref={ref}
                    value={value}
                    onChange={handleChange}
                    onDebouncedChange={args.onDebouncedChange ? handleDebouncedChange : undefined}
                    onThrottledChange={args.onThrottledChange ? handleThrottledChange : undefined}
                />
            </div>

            <div className={styles.panel}>
                <button type="button" className={styles.button} onClick={handleSetValue}>
                    Установить текст
                </button>
                <button type="button" className={styles.button} onClick={handleSetFocus}>
                    Установить фокус
                </button>
                <button type="button" className={styles.button} onClick={handleChangeContentSize}>
                    {isContentWide ? 'Сузить поле' : 'Расширить поле'}
                </button>
            </div>
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

export const AutoHeight: TStory = {
    name: 'Автоматическая высота',
    args: { withAutoHeight: true, rows: 2 },
    render: args => <PlaygroundComponent {...args} />
};

export const Combined: TStory = {
    name: 'Совместная работа',
    args: {
        withAutoHeight: true,
        onDebouncedChange: fn(),
        debounceDelay: 600,
        onThrottledChange: fn(),
        throttleDelay: 400
    },
    render: args => <PlaygroundComponent {...args} />
};
