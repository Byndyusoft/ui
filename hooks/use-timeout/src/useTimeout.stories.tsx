import React, { useState } from 'react';
import { StoryFn } from '@storybook/react';
import useTimeout from './useTimeout';

export const Template: StoryFn = args => {
    const [count, setCount] = useState(0);
    const [message, setMessage] = useState('');

    const { start } = useTimeout(() => {
        setMessage(`The timer is completed with a value of ${count}`);
    }, args.delay);

    return (
        <div>
            <h1>Пример использования useTimeout</h1>
            <h2>Count: {count}</h2>
            <button onClick={() => setCount(prev => prev + 1)}>Increment</button>
            <button onClick={start}>Start Timer</button>
            <h3>{message}</h3>
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
                type: { summary: 'number' }
            },
            control: { type: 'number', value: 2000 },
            required: true,
            defaultValue: 2000
        }
    }
};
