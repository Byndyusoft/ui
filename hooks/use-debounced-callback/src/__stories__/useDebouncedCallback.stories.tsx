import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import useDebouncedCallback from '../index';

const DebouncedCallbackExample = (): JSX.Element => {
    const [value, setValue] = useState('');
    const [savedValue, setSavedValue] = useState('');
    const save = useDebouncedCallback(setSavedValue, 500);
    const handleFlush = save.flush;
    const handleCancel = save.cancel;

    return (
        <div style={{ display: 'grid', gap: 16, maxWidth: 400 }}>
            <label style={{ display: 'grid', gap: 8 }}>
                Введите текст
                <input
                    value={value}
                    onChange={event => {
                        const nextValue = event.target.value;

                        setValue(nextValue);
                        save(nextValue);
                    }}
                />
            </label>
            <p>Сохранённое значение: {savedValue || '—'}</p>
            <p>Значение сохраняется после паузы в 500 мс.</p>
            <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" onClick={handleFlush}>
                    Сохранить сейчас
                </button>
                <button type="button" onClick={handleCancel}>
                    Отменить сохранение
                </button>
            </div>
        </div>
    );
};

export const Playground: StoryObj<typeof DebouncedCallbackExample> = {
    name: 'Вызов после паузы',
    render: () => <DebouncedCallbackExample />
};

export default {
    title: 'hooks/useDebouncedCallback'
} satisfies Meta;
