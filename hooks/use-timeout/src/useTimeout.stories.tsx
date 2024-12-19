import React, { useState } from 'react';
import { StoryFn } from '@storybook/react';
import useTimeout from './useTimeout';

export const Template: StoryFn = args => {
    const [message, setMessage] = useState('Нажмите "Start" для запуска таймера');
    const { start, stop } = useTimeout(args.callback ?? (() => setMessage('Таймаут завершён!')), args.delay ?? 3000);

    return (
        <div style={{ maxWidth: 400, margin: 'auto' }}>
            <h3>Пример использования useTimeout</h3>
            <p>{message}</p>
            <button
                onClick={() => {
                    setMessage('Таймер запущен');
                    start();
                }}
            >
                Start
            </button>
            <button
                onClick={() => {
                    setMessage('Таймер остановлен');
                    stop();
                }}
            >
                Stop
            </button>
        </div>
    );
};

export default {
    title: 'Hooks/useTimeout',
    argTypes: {
        callback: {
            description: 'The callback function to be invoked after the specified delay (required).',
            table: {
                type: { summary: '() => void' }
            },
            control: { type: 'function' },
            required: true
        },
        delay: {
            description: 'The delay in milliseconds before invoking the callback (required).',
            table: {
                type: { summary: 'number', value: 200 }
            },
            control: { type: 'number' },
            required: true,
            defaultValue: 200
        }
    }
};
