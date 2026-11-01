import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import useDebouncedValue from '../index';

const DebouncedValueExample = (): JSX.Element => {
    const [value, setValue] = useState('');
    const [delay, setDelay] = useState(500);
    const [debouncedValue, setDebouncedValue] = useDebouncedValue('', delay);
    const handleFlush = setDebouncedValue.flush;
    const handleCancel = setDebouncedValue.cancel;

    return (
        <div>
            <label>
                Введите текст
                <input
                    value={value}
                    onChange={event => {
                        const nextValue = event.target.value;

                        setValue(nextValue);
                        setDebouncedValue(nextValue);
                    }}
                />
            </label>
            <label>
                Задержка
                <select value={delay} onChange={event => setDelay(Number(event.target.value))}>
                    <option value={0}>0 мс</option>
                    <option value={500}>500 мс</option>
                    <option value={1000}>1000 мс</option>
                </select>
            </label>
            <p>Текущее значение: {value || '—'}</p>
            <p>Значение после паузы: {debouncedValue || '—'}</p>
            <button type="button" onClick={handleFlush}>
                Применить сейчас
            </button>
            <button type="button" onClick={handleCancel}>
                Отменить обновление
            </button>
        </div>
    );
};

export const Playground: StoryObj<typeof DebouncedValueExample> = {
    name: 'Значение после паузы',
    render: () => <DebouncedValueExample />
};

export default {
    title: 'hooks/useDebouncedValue'
} satisfies Meta;
